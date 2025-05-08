import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../lib/auth';

// Define types for our feed data
type Comment = {
  id: string;
  user: string;
  text: string;
  timestamp: string;
};

type Post = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  liked: boolean;
};

// Mock data for feed posts
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Emma Johansson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    caption: 'Morning run complete! 5km in 25 minutes. #fitness #running',
    likes: 24,
    comments: [
      { id: 'c1', user: 'Lisa', text: 'Great job! Keep it up! 💪', timestamp: '2h ago' },
      { id: 'c2', user: 'Marcus', text: 'Impressive time!', timestamp: '1h ago' },
    ],
    timestamp: '2h ago',
    liked: false,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Anders Svensson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    caption: 'Meal prep for the week done! Healthy eating is the foundation of fitness. #mealprep #nutrition',
    likes: 42,
    comments: [
      { id: 'c3', user: 'Johan', text: 'Looks delicious! Recipe please?', timestamp: '3h ago' },
    ],
    timestamp: '4h ago',
    liked: false,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Maja Nilsson',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    caption: 'New personal best on deadlift today! 100kg x 5 reps 💪 #strengthtraining #gym',
    likes: 56,
    comments: [
      { id: 'c4', user: 'Erik', text: 'Beast mode! 🔥', timestamp: '1h ago' },
      { id: 'c5', user: 'Anna', text: 'So strong! Inspiring!', timestamp: '30m ago' },
    ],
    timestamp: '5h ago',
    liked: true,
  },
];

export default function Feed() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newComment, setNewComment] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    setActivePostId(postId);
    setShowComments(true);
  };

  const submitComment = () => {
    if (!newComment.trim() || !activePostId) return;

    setPosts(posts.map(post => {
      if (post.id === activePostId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c${Date.now()}`,
              user: user?.email?.split('@')[0] || 'User',
              text: newComment.trim(),
              timestamp: 'Just now'
            }
          ]
        };
      }
      return post;
    }));

    setNewComment('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
    }
  };

  const createNewPost = () => {
    if (!newPostImage) {
      Alert.alert('Error', 'Please select an image for your post');
      return;
    }

    const newPost = {
      id: `p${Date.now()}`,
      user: {
        id: user?.id || 'current-user',
        name: user?.email?.split('@')[0] || 'User',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      image: newPostImage,
      caption: newPostCaption.trim(),
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setShowNewPost(false);
    setNewPostImage(null);
    setNewPostCaption('');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <Image source={{ uri: item.image }} style={styles.postImage} />
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleLike(item.id)}
        >
          <Ionicons 
            name={item.liked ? "heart" : "heart-outline"} 
            size={24} 
            color={item.liked ? "#e74c3c" : "#333"} 
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#333" />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.captionContainer}>
        <Text style={styles.captionName}>{item.user.name}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
      
      {item.comments.length > 0 && (
        <TouchableOpacity 
          style={styles.viewCommentsButton}
          onPress={() => handleComment(item.id)}
        >
          <Text style={styles.viewCommentsText}>
            View {item.comments.length > 1 ? `all ${item.comments.length} comments` : '1 comment'}
          </Text>
        </TouchableOpacity>
      )}
      
      {item.comments.length > 0 && (
        <View style={styles.commentPreview}>
          <Text style={styles.commentUser}>{item.comments[0].user}</Text>
          <Text style={styles.commentText}>{item.comments[0].text}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fitness Feed</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => setShowNewPost(true)}
        >
          <Ionicons name="add-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
      
      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {activePostId && posts.find(p => p.id === activePostId)?.comments.map(comment => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </ScrollView>
            
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.commentInputContainer}
            >
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={styles.postCommentButton}
                onPress={submitComment}
                disabled={!newComment.trim()}
              >
                <Text style={[
                  styles.postCommentText, 
                  !newComment.trim() && styles.postCommentDisabled
                ]}>Post</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
      
      {/* New Post Modal */}
      <Modal
        visible={showNewPost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPost(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.newPostContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>New Post</Text>
              <TouchableOpacity onPress={() => setShowNewPost(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.imagePickerContainer}
              onPress={pickImage}
            >
              {newPostImage ? (
                <Image source={{ uri: newPostImage }} style={styles.newPostImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#aaa" />
                  <Text style={styles.imagePlaceholderText}>Tap to select an image</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              value={newPostCaption}
              onChangeText={setNewPostCaption}
              multiline
              maxLength={300}
            />
            
            <TouchableOpacity 
              style={[styles.createPostButton, !newPostImage && styles.disabledButton]}
              onPress={createNewPost}
              disabled={!newPostImage}
            >
              <Text style={styles.createPostText}>Share Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  newPostButton: {
    padding: 5,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 13,
    color: '#999',
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  captionContainer: {
    padding: 12,
    paddingTop: 0,
  },
  captionName: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewCommentsButton: {
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  viewCommentsText: {
    fontSize: 13,
    color: '#999',
  },
  commentPreview: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  commentText: {
    fontSize: 14,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  commentsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    padding: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  postCommentButton: {
    marginLeft: 10,
    padding: 10,
  },
  postCommentText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  postCommentDisabled: {
    color: '#aaa',
  },
  newPostContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  imagePickerContainer: {
    height: 250,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#999',
    marginTop: 10,
  },
  newPostImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  captionInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  createPostButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  createPostText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
});
