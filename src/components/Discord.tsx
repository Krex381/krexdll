'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Atropos from 'atropos/react';
import 'atropos/css';

interface DiscordActivity {
  flags: number;      
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
  buttons?: string[];
  platform?: string;
}

interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  banner?: string;
  banner_color?: string;
  discriminator: string;
  clan: unknown;
  primary_guild?: {
    tag: string;
    identity_guild_id: string;
    badge: string;
    identity_enabled: boolean;
  };
  avatar_decoration_data: unknown;
  collectibles: unknown;
  bot: boolean;
  global_name: string;
  display_name: string;
  public_flags: number;
}

interface ConnectedAccount {
  type: string;
  id: string;
  name: string;
  verified: boolean;
  metadata?: {
    [key: string]: string;
  };
}

interface Badge {
  id: string;
  description: string;
  icon: string;
  link: string;
}

interface ProfileData {
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    banner: string;
    bio: string;
    premium_since?: string;
    premium_type?: number;
  };
  user_profile: {
    bio: string;
    pronouns?: string;
    theme_colors?: number[];
  };
  connected_accounts: ConnectedAccount[];
  badges: Badge[];
  cached: boolean;
}

interface LanyardData {
  discord_user: DiscordUser;
  activities: DiscordActivity[];
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_embedded: boolean;
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
  kv?: {
    [key: string]: string;
  };
}

const STATUS_COLORS = {
  online: '#23a55a',
  idle: '#f0b232',
  dnd: '#f23f43',
  offline: '#80848e'
};

const STATUS_LABELS = {
  online: 'Online',
  idle: 'Away',
  dnd: 'Do Not Disturb',
  offline: 'Offline'
};

export default function Discord() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<LanyardData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Fetch profile data once on mount
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://dcdn.dstn.to/profile/644313519147319297');
        if (response.ok) {
          const profileData = await response.json();
          setProfileData(profileData);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();

    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: NodeJS.Timeout;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.op === 1) {
        // Hello - start heartbeat
        heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 3 }));
          }
        }, message.d.heartbeat_interval);

        // Initialize
        ws.send(JSON.stringify({
          op: 2,
          d: {
            subscribe_to_ids: ['644313519147319297']
          }
        }));
      } else if (message.op === 0) {
        // Event - any presence update
        if (message.t === 'INIT_STATE') {
          const userData = message.d['644313519147319297'];
          if (userData) {
            setData(userData);
          }
        } else if (message.t === 'PRESENCE_UPDATE') {
          const userData = message.d;
          if (userData && userData.discord_user.id === '644313519147319297') {
            setData(userData);
          }
        }
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (!connected) {
          // The effect will re-run and create a new connection
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('Lanyard WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connected]); // Re-run when connection status changes

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getAvatarUrl = (user: DiscordUser) => {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`;
  };

  const getBannerUrl = (user: DiscordUser) => {
    if (user.banner) {
      return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith('a_') ? 'gif' : 'png'}?size=512`;
    }
    // Fallback to profile data banner if available
    if (profileData?.user.banner) {
      return `https://cdn.discordapp.com/banners/${user.id}/${profileData.user.banner}.${profileData.user.banner.startsWith('a_') ? 'gif' : 'png'}?size=512`;
    }
    return null;
  };

  const getGuildBadgeUrl = (guild: DiscordUser['primary_guild']) => {
    if (guild?.badge) {
      return `https://cdn.discordapp.com/clan-badges/${guild.identity_guild_id}/${guild.badge}.png?size=64`;
    }
    return null;
  };

  const getActivityImageUrl = (image: string) => {
    if (image.startsWith('mp:external/')) {
      return image.replace('mp:external/', 'https://media.discordapp.net/external/');
    }
    return `https://cdn.discordapp.com/app-assets/${image}`;
  };

  const getConnectedAccountIcon = (type: string): React.ReactElement => {
    const icons: { [key: string]: React.ReactElement } = {
      github: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      spotify: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
      twitter: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      reddit: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      domain: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      steam: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.624 0 11.999-5.375 11.999-12C23.978 5.376 18.603.001 11.979.001zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.955-1.497 1.409-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
        </svg>
      ),
      youtube: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      twitch: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      )
    };
    return icons[type] || (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
        <path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z"/>
      </svg>
    );
  };

  const getBadgeIconUrl = (iconHash: string) => {
    return `https://cdn.discordapp.com/badge-icons/${iconHash}.png`;
  };

  const getAccountUrl = (account: ConnectedAccount) => {
    const urls: { [key: string]: string } = {
      github: `https://github.com/${account.name}`,
      spotify: `https://open.spotify.com/user/${account.id}`,
      twitter: `https://twitter.com/${account.name}`,
      reddit: `https://reddit.com/user/${account.name}`,
      domain: `https://${account.name}`,
      steam: `https://steamcommunity.com/profiles/${account.id}`,
      youtube: `https://youtube.com/channel/${account.id}`,
      twitch: `https://twitch.tv/${account.name}`
    };
    return urls[account.type] || '#';
  };

  return (
    <section 
      id="discord"
      ref={ref}
      className="min-h-screen flex items-start justify-center relative bg-black overflow-y-auto"
      style={{ maxHeight: '100vh' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 z-10 w-full max-w-4xl py-8 pb-32 md:pb-8"
      >
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8 mt-16 md:mt-27"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Discord Live Status</h2>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-gray-300 text-sm">{connected ? 'Real-time Connected' : 'Disconnected'}</span>
          </div>
        </motion.div>

        {data ? (
          <Atropos
            className="discord-atropos max-w-md mx-auto"
            rotateXMax={8}
            rotateYMax={8}
            duration={300}
            shadow={false}
            highlight={false}
          >
            <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* 3D Background Elements */}
              <div data-atropos-offset="-5" className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
              <div data-atropos-offset="-3" className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div data-atropos-offset="-2" className="absolute bottom-2 left-2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>

              {/* Banner Section */}
              <div data-atropos-offset="0" className="relative h-20 overflow-hidden">
                {getBannerUrl(data.discord_user) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={getBannerUrl(data.discord_user)!}
                      alt="Discord Banner"
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/60"></div>
                  </div>
                ) : data.discord_user.banner_color ? (
                  <div 
                    className="w-full h-full"
                    style={{ 
                      background: `linear-gradient(135deg, ${data.discord_user.banner_color}80, ${data.discord_user.banner_color}40)` 
                    }}
                  ></div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-600/60"></div>
                )}
              </div>

              <div className="relative px-6 pb-6 -mt-16">
                {/* Avatar Section */}
                <div data-atropos-offset="8" className="flex flex-col items-center mb-4">
                  <div className="relative">
                    {/* Custom Status Speech Bubble */}
                    {data.activities.find(activity => activity.type === 4 && activity.state) && (
                      <motion.div
                        data-atropos-offset="12"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 max-w-xs z-20"
                      >
                        <div className="relative bg-gray-800/95 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-2xl border border-gray-600/40 shadow-xl">
                          <span className="break-words font-medium">{data.activities.find(activity => activity.type === 4)?.state}</span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-gray-800/95"></div>
                        </div>
                      </motion.div>
                    )}

                    {/* Avatar with 3D effect */}
                    <div data-atropos-offset="10" className="relative w-24 h-24 mx-auto">
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-700/50 bg-gray-800 shadow-2xl">
                        <Image
                          src={getAvatarUrl(data.discord_user)}
                          alt={data.discord_user.display_name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      {/* Status indicator with glow */}
                      <div 
                        data-atropos-offset="15"
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-3 border-gray-800 shadow-lg"
                        style={{ 
                          backgroundColor: STATUS_COLORS[data.discord_status],
                          boxShadow: `0 0 20px ${STATUS_COLORS[data.discord_status]}50`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div data-atropos-offset="6" className="text-center mt-2">
                    <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold text-white">
                        {data.discord_user.display_name || data.discord_user.global_name}
                      </h3>
                      {/* Guild Badge */}
                      {data.discord_user.primary_guild && (
                        <div data-atropos-offset="8" className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg border border-purple-500/50 backdrop-blur-sm">
                          {getGuildBadgeUrl(data.discord_user.primary_guild) && (
                            <div className="w-4 h-4 rounded-sm overflow-hidden flex-shrink-0">
                              <Image
                                src={getGuildBadgeUrl(data.discord_user.primary_guild)!}
                                alt={`${data.discord_user.primary_guild.tag} badge`}
                                width={20}
                                height={20}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="text-purple-300 font-mono text-xs font-bold">
                            {data.discord_user.primary_guild.tag}
                          </span>
                          {data.discord_user.primary_guild.identity_enabled && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Identity Enabled"></div>
                          )}
                        </div>
                      )}
                      {/* Badges next to username */}
                      {profileData?.badges && profileData.badges.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {profileData.badges.map((badge, index) => (
                            <motion.div
                              key={badge.id}
                              data-atropos-offset="8"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 + 0.5 }}
                              className="group relative"
                            >
                              <div className="w-5 h-5 bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-md flex items-center justify-center shadow-lg hover:border-blue-500/50 transition-colors">
                                <Image
                                  src={getBadgeIconUrl(badge.icon)}
                                  alt={badge.description}
                                  width={12}
                                  height={12}
                                  className="object-cover"
                                />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-gray-600/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                {badge.description}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">@{data.discord_user.username}</p>
                    
                    {/* Pronouns */}
                    {profileData?.user_profile.pronouns && (
                      <p className="text-gray-500 text-xs mb-2">{profileData.user_profile.pronouns}</p>
                    )}

                    {/* Bio */}
                    {profileData?.user_profile.bio && (
                      <div data-atropos-offset="4" className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-lg p-2 mb-2 max-w-sm mx-auto">
                        <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                          {profileData.user_profile.bio}
                        </p>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div data-atropos-offset="4" className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full border border-gray-600/40 backdrop-blur-sm">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: STATUS_COLORS[data.discord_status] }}
                      ></div>
                      <span className="text-xs text-gray-200 font-medium">{STATUS_LABELS[data.discord_status]}</span>
                    </div>
                  </div>

                </div>

                {/* Activities Section */}
                <div className="space-y-2 mt-3">
                  {/* Platform Indicators Header */}
                  <div data-atropos-offset="4" className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">Current Activity</h4>
                    <div className="flex gap-1">
                      {data.active_on_discord_desktop && (
                        <div className="w-7 h-7 bg-green-500/30 rounded-md flex items-center justify-center border border-green-500/50 backdrop-blur-sm shadow-lg" title="Desktop">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-300">
                            <path d="M21 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8v2H8v2h8v-2h-3v-2h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM20 16H4V4h16z"/>
                          </svg>
                        </div>
                      )}
                      {data.active_on_discord_web && (
                        <div className="w-7 h-7 bg-blue-500/30 rounded-md flex items-center justify-center border border-blue-500/50 backdrop-blur-sm shadow-lg" title="Web">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-300">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                          </svg>
                        </div>
                      )}
                      {data.active_on_discord_mobile && (
                        <div className="w-7 h-7 bg-purple-500/30 rounded-md flex items-center justify-center border border-purple-500/50 backdrop-blur-sm shadow-lg" title="Mobile">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-purple-300">
                            <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Spotify */}
                  {data.listening_to_spotify && data.spotify && (
                    <div data-atropos-offset="4" className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-2 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
</div>
                        <h4 className="text-sm font-semibold text-white">Listening to Spotify</h4>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div data-atropos-offset="8" className="w-14 h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                          <Image
                            src={data.spotify.album_art_url}
                            alt={data.spotify.album}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate text-sm">{data.spotify.song}</p>
                          <p className="text-green-200 truncate text-xs">by {data.spotify.artist}</p>
                          <p className="text-green-300 text-xs truncate">on {data.spotify.album}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Activities */}
                  {data.activities.filter(activity => activity.type !== 2 && activity.type !== 4).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      data-atropos-offset="4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-lg p-2 shadow-lg"
                    >
                      <div className="flex items-start gap-2">
                        {activity.assets?.large_image && (
                          <div data-atropos-offset="8" className="w-14 h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                            <Image
                              src={getActivityImageUrl(activity.assets.large_image)}
                              alt={activity.assets.large_text || activity.name}
                              width={56}
                              height={56}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white mb-1 text-sm">{activity.name}</h4>
                          {activity.details && (
                            <p className="text-gray-300 text-xs mb-1 truncate">{activity.details}</p>
                          )}
                          {activity.state && (
                            <p className="text-gray-400 text-xs mb-1 truncate">{activity.state}</p>
                          )}
                          {activity.timestamps?.start && (
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-500 text-xs">
                                {formatTimestamp(activity.timestamps.start)} elapsed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* No Activities */}
                  {data.activities.length === 0 && !data.listening_to_spotify && (
                    <div data-atropos-offset="2" className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-lg p-3 shadow-lg text-center">
                      <div className="text-gray-400 text-xl mb-1">💤</div>
                      <p className="text-gray-400 text-xs">Currently not active</p>
                    </div>
                  )}

                  {/* Connected Accounts Section */}
                  {profileData?.connected_accounts && profileData.connected_accounts.length > 0 && (
                    <div data-atropos-offset="4" className="mt-4 pt-3 border-t border-gray-700/30">
                      <h4 className="text-sm font-semibold text-white mb-2 text-center">Connected Accounts</h4>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {profileData.connected_accounts.map((account, index) => (
                          <motion.a
                            key={`${account.type}-${account.id}`}
                            href={getAccountUrl(account)}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-atropos-offset="6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                            className="group relative"
                          >
                            <div className="w-10 h-10 bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-lg flex items-center justify-center shadow-lg hover:border-blue-500/50 hover:scale-110 transition-all duration-200">
                              <div className="flex-shrink-0">
                                {getConnectedAccountIcon(account.type)}
                              </div>
                              {account.verified && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-gray-600/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              <div className="text-center">
                                <p className="font-medium capitalize">{account.type}</p>
                                <p className="text-gray-300">{account.name}</p>
                                {account.metadata && (
                                  <p className="text-gray-400 text-xs mt-1">
                                    {account.type === 'reddit' && account.metadata.total_karma && (
                                      <span>{account.metadata.total_karma} karma</span>
                                    )}
                                    {account.type === 'twitter' && account.metadata.followers_count && (
                                      <span>{account.metadata.followers_count} followers</span>
                                    )}
                                  </p>
                                )}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900/95"></div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Atropos>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl">
              {connected ? (
                <>
                  <div className="animate-spin w-12 h-12 border-3 border-gray-600 border-t-white rounded-full mx-auto mb-6"></div>
                  <p className="text-gray-300 text-lg">Loading Discord status...</p>
                </>
              ) : (
                <>
                  <div className="text-red-400 text-5xl mb-6">⚠️</div>
                  <p className="text-gray-300 text-lg">Failed to connect to Discord</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
