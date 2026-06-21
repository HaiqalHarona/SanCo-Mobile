import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const theme = useTheme();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ id: string; name: string }>();

  const displayName = name || 'Chat';
  const displayAvatar = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isDark = scheme === 'dark';
  const primaryColor = '#6366F1';
  const headerBg = isDark ? 'rgba(20, 20, 28, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const otherMsgBg = isDark ? '#2E3135' : '#EAECEF';
  const otherMsgText = theme.text;
  const inputBg = isDark ? 'rgba(25, 25, 35, 0.7)' : 'rgba(240, 241, 245, 0.8)';

  // Static mock conversation history
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'other', text: 'Hey there! How is everything going?', time: '10:00 AM' },
    { id: '2', sender: 'me', text: 'Hey! Doing well, just working on this new messenger UI.', time: '10:02 AM' },
    { id: '3', sender: 'other', text: 'Nice! Is it using Expo and React Native?', time: '10:03 AM' },
    { id: '4', sender: 'me', text: 'Yes, it is. Extremely fast and looks clean with the new theme controls.', time: '10:04 AM' },
    { id: '5', sender: 'other', text: 'Awesome, can’t wait to see the final build! Let me know if you need any testers.', time: '10:05 AM' },
  ]);

  const [inputVal, setInputVal] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!inputVal.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View
          style={[
            styles.messageBubble,
            isMe
              ? [styles.myBubble, { backgroundColor: primaryColor }]
              : [styles.otherBubble, { backgroundColor: otherMsgBg }],
          ]}
        >
          <Text style={[styles.messageText, { color: isMe ? '#FFFFFF' : otherMsgText }]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.messageTime, { color: theme.textSecondary }]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Navigation Header */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: borderCol, paddingTop: Math.max(insets.top, Spacing.three) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <SymbolView name="chevron.left" tintColor={theme.text} size={22} />
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <Text style={styles.avatarText}>{displayAvatar}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.userStatus, { color: '#10B981' }]}>Online</Text>
          </View>
        </View>

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <SymbolView name="phone" tintColor={theme.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <SymbolView name="video" tintColor={theme.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <View style={[styles.inputBar, { borderTopColor: borderCol, paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
          <TouchableOpacity style={[styles.attachButton, { backgroundColor: inputBg }]} activeOpacity={0.7}>
            <SymbolView name="plus" tintColor={theme.text} size={20} />
          </TouchableOpacity>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.textSecondary}
              value={inputVal}
              onChangeText={setInputVal}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: primaryColor }]}
            onPress={sendMessage}
            activeOpacity={0.8}
          >
            <SymbolView name="paperplane.fill" tintColor="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.two,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.one,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  textContainer: {
    marginLeft: Spacing.two,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 150,
  },
  userStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  actionButton: {
    padding: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  messageWrapper: {
    maxWidth: '75%',
    marginVertical: Spacing.half,
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: Spacing.three + 2,
    paddingVertical: Spacing.two,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    padding: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
