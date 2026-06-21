import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface ChatItem {
  id: string;
  name: string;
  avatarText: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
}

const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    avatarText: 'SJ',
    avatarBg: '#EC4899', // Pink
    lastMessage: 'Hey! Did you check out the new design prototypes?',
    time: '2m ago',
    unreadCount: 3,
    online: true,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    avatarText: 'MC',
    avatarBg: '#3B82F6', // Blue
    lastMessage: 'Let’s sync tomorrow morning at 10 AM.',
    time: '15m ago',
    unreadCount: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Elena Rostova',
    avatarText: 'ER',
    avatarBg: '#10B981', // Emerald
    lastMessage: 'Thanks for the quick feedback, it helped a lot!',
    time: '1h ago',
    unreadCount: 1,
    online: false,
  },
  {
    id: '4',
    name: 'David Kojo',
    avatarText: 'DK',
    avatarBg: '#F59E0B', // Amber
    lastMessage: 'I sent over the project proposal documents.',
    time: '4h ago',
    unreadCount: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Sophia Martinez',
    avatarText: 'SM',
    avatarBg: '#8B5CF6', // Purple
    lastMessage: 'Are we still on for lunch later today?',
    time: 'Yesterday',
    unreadCount: 0,
    online: true,
  },
  {
    id: '6',
    name: 'Oliver Brown',
    avatarText: 'OB',
    avatarBg: '#6B7280', // Gray
    lastMessage: 'Sounds good. Let me know when you submit.',
    time: '2 days ago',
    unreadCount: 0,
    online: false,
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const isDark = scheme === 'dark';
  const primaryColor = '#6366F1';
  const searchBg = isDark ? 'rgba(25, 25, 35, 0.7)' : 'rgba(240, 241, 245, 0.8)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  const filteredChats = MOCK_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id, name: item.name } })}
        style={({ pressed }) => [
          styles.chatItem,
          { borderColor: borderCol },
          pressed && { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' },
        ]}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
          <Text style={styles.avatarText}>{item.avatarText}</Text>
          {item.online && (
            <View style={[styles.onlineBadge, { borderColor: theme.background }]} />
          )}
        </View>

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.chatTime, { color: theme.textSecondary }]}>{item.time}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text
              style={[
                styles.lastMessage,
                { color: item.unreadCount > 0 ? theme.text : theme.textSecondary },
                item.unreadCount > 0 && styles.unreadMessageText,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: primaryColor }]}>
                <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Math.max(insets.top, Spacing.three) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={[styles.logoutBtn, { borderColor: borderCol, backgroundColor: searchBg }]}
          activeOpacity={0.7}
        >
          <SymbolView name="rectangle.portrait.and.arrow.right" tintColor={theme.text} size={18} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchWrapper, { backgroundColor: searchBg }]}>
          <SymbolView name="magnifyingglass" tintColor={theme.textSecondary} size={16} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search messages..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SymbolView name="bubble.left.and.bubble.right" tintColor={theme.textSecondary} size={40} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No messages found</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor, bottom: Math.max(insets.bottom + 16, 24) }]}
        activeOpacity={0.8}
      >
        <SymbolView name="plus" tintColor="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    marginVertical: Spacing.two,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: Spacing.two,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
  },
  chatInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.half,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.two,
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: Spacing.three,
  },
  unreadMessageText: {
    fontWeight: '600',
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six * 2,
  },
  emptyText: {
    marginTop: Spacing.two,
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
