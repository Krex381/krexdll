'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

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
  clan: any;
  primary_guild?: {
    tag: string;
    identity_guild_id: string;
    badge: string;
    identity_enabled: boolean;
  };
  avatar_decoration_data: any;
  collectibles: any;
  bot: boolean;
  global_name: string;
  display_name: string;
  public_flags: number;
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
  const [connected, setConnected] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
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

    ws.onclose = (event) => {
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
    return `https://cdn.discordapp.com/banners/644313519147319297/a_4fea9364c30e3de38040ac73e0298c6c.gif?size=512`;
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

  return (
    <section 
      id="discord"
      ref={ref}
      className="min-h-screen flex items-start md:items-center justify-center relative bg-black py-20 md:py-0"
    >
      {/* Background with dark glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-black/50" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container mx-auto px-6 z-10 w-full"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Discord Status</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full" />
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-300">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </motion.div>

          {data ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Card */}
              <motion.div variants={itemVariants} className="group relative">
                <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl overflow-hidden shadow-lg hover:bg-black/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  {/* Banner */}
                  {getBannerUrl(data.discord_user) ? (
                    <div className="relative h-24 w-full">
                      <Image
                        src={getBannerUrl(data.discord_user)!}
                        alt="Banner"
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>
                  ) : data.discord_user.banner_color ? (
                    <div 
                      className="h-24 w-full"
                      style={{ backgroundColor: data.discord_user.banner_color }}
                    ></div>
                  ) : (
                    <div className="h-24 w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50"></div>
                  )}
                  
                  <div className="relative p-8 -mt-16">
                    {/* Avatar with status indicator */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      {/* Custom Status Speech Bubble */}
                      {data.activities.find(activity => activity.type === 4 && activity.state) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="absolute -top-16 -right-8 max-w-[180px] z-20"
                        >
                          <div className="relative bg-gray-800/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-xl border border-gray-600/40 shadow-xl">
                            <span className="break-words">{data.activities.find(activity => activity.type === 4)?.state}</span>
                            {/* Speech bubble tail pointing to avatar */}
                            <div className="absolute bottom-0 left-6 w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-t-4 border-t-gray-800/95 transform translate-y-full"></div>
                          </div>
                        </motion.div>
                      )}
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-800 bg-gray-800">
                        <Image
                          src={getAvatarUrl(data.discord_user)}
                          alt={data.discord_user.display_name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      {/* Status indicator */}
                      <div 
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-gray-800"
                        style={{ backgroundColor: STATUS_COLORS[data.discord_status] }}
                      ></div>
                    </div>

                    {/* User info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {data.discord_user.display_name || data.discord_user.global_name}
                        </h3>
                        {/* Guild tag with badge */}
                        {data.discord_user.primary_guild && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                            {getGuildBadgeUrl(data.discord_user.primary_guild) && (
                              <div className="w-4 h-4 rounded-sm overflow-hidden flex-shrink-0">
                                <Image
                                  src={getGuildBadgeUrl(data.discord_user.primary_guild)!}
                                  alt={`${data.discord_user.primary_guild.tag} badge`}
                                  width={16}
                                  height={16}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="text-purple-400 font-mono text-sm font-bold">
                              {data.discord_user.primary_guild.tag}
                            </span>
                            {data.discord_user.primary_guild.identity_enabled && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Identity Enabled"></div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">@{data.discord_user.username}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full border border-gray-600/30">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[data.discord_status] }}
                        ></div>
                        <span className="text-sm text-gray-300">{STATUS_LABELS[data.discord_status]}</span>
                      </div>

                      {/* Platform indicators */}
                      <div className="flex justify-center gap-4 mt-6">
                        {data.active_on_discord_desktop && (
                          <motion.div 
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-400 group-hover:text-green-300">
                              <path d="M21 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8v2H8v2h8v-2h-3v-2h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM20 16H4V4h16z"/>
                              <rect x="6" y="6" width="12" height="8" rx="1" fill="currentColor" opacity="0.5"/>
                            </svg>
                          </motion.div>
                        )}
                        {data.active_on_discord_web && (
                          <motion.div 
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400 group-hover:text-blue-300">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                              <path d="M12 6.5c3.03 0 5.5 2.47 5.5 5.5s-2.47 5.5-5.5 5.5S6.5 15.53 6.5 12 8.97 6.5 12 6.5z" fill="currentColor" opacity="0.2"/>
                            </svg>
                          </motion.div>
                        )}
                        {data.active_on_discord_mobile && (
                          <motion.div 
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400 group-hover:text-purple-300">
                              <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v13H7V4z"/>
                              <rect x="9" y="6" width="6" height="8" rx="0.5" fill="currentColor" opacity="0.3"/>
                              <circle cx="12" cy="19" r="1" fill="currentColor"/>
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Activities */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Spotify */}
                {data.listening_to_spotify && data.spotify && (
                  <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">♪</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">Listening to Spotify</h4>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={data.spotify.album_art_url}
                          alt={data.spotify.album}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{data.spotify.song}</p>
                        <p className="text-gray-400 truncate">by {data.spotify.artist}</p>
                        <p className="text-gray-500 text-sm truncate">on {data.spotify.album}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Activities */}
                {data.activities.filter(activity => activity.type !== 2 && activity.type !== 4).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {activity.assets?.large_image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getActivityImageUrl(activity.assets.large_image)}
                            alt={activity.assets.large_text || activity.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1">{activity.name}</h4>
                        {activity.details && (
                          <p className="text-gray-300 text-sm mb-1">{activity.details}</p>
                        )}
                        {activity.state && (
                          <p className="text-gray-400 text-sm mb-2">{activity.state}</p>
                        )}
                        {activity.timestamps?.start && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-500 text-xs">
                              {formatTimestamp(activity.timestamps.start)} elapsed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* No activities */}
                {data.activities.length === 0 && !data.listening_to_spotify && (
                  <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-8 shadow-lg text-center">
                    <div className="text-gray-400 mb-2">💤</div>
                    <p className="text-gray-400">No current activities</p>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-black/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-12 shadow-lg">
                {connected ? (
                  <>
                    <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-white rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Discord status...</p>
                  </>
                ) : (
                  <>
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-400">Failed to connect to Discord</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
