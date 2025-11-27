import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonAvatar,
  IonBadge,
  IonToast,
  IonActionSheet
} from '@ionic/react';
import {
  sendOutline,
  refreshOutline,
  peopleOutline,
  arrowUndoOutline,
  closeOutline,
  trashOutline,
  ellipsisVerticalOutline
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Messages.css';

interface Message {
  id: number;
  content: string;
  senderId: number;
  senderUsername: string;
  senderRole: string;
  senderProfilePicture?: string | null;
  createdAt: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await messageService.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      let messageContent = newMessage;
      
      // If replying, add reply indicator to message
      if (replyingTo) {
        messageContent = `@${replyingTo.senderUsername}: ${newMessage}`;
      }

      // Send as broadcast message (general chat)
      await messageService.sendMessage({ 
        content: messageContent,
        isBroadcast: true 
      });
      setNewMessage('');
      setReplyingTo(null); // Clear reply state
      await loadMessages();
      scrollToBottom();
    } catch (error: any) {
      console.error('Send message error:', error);
      setToast({ 
        show: true, 
        message: error.response?.data?.error || 'Error sending message', 
        color: 'danger' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    // Focus on input (optional - browser will handle this)
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleDeleteClick = (message: Message) => {
    setSelectedMessage(message);
    setShowDeleteOptions(true);
  };

  const handleDeleteForMe = async () => {
    if (!selectedMessage) return;

    try {
      await messageService.deleteMessageForMe(selectedMessage.id);
      setToast({ show: true, message: 'Message deleted for you', color: 'success' });
      await loadMessages();
    } catch (error: any) {
      setToast({ 
        show: true, 
        message: error.response?.data?.error || 'Error deleting message', 
        color: 'danger' 
      });
    } finally {
      setShowDeleteOptions(false);
      setSelectedMessage(null);
    }
  };

  const handleDeleteForEveryone = async () => {
    if (!selectedMessage) return;

    try {
      await messageService.deleteMessageForEveryone(selectedMessage.id);
      setToast({ show: true, message: 'Message deleted for everyone', color: 'success' });
      await loadMessages();
    } catch (error: any) {
      setToast({ 
        show: true, 
        message: error.response?.data?.error || 'Error deleting message', 
        color: 'danger' 
      });
    } finally {
      setShowDeleteOptions(false);
      setSelectedMessage(null);
    }
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollToBottom(300);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: any = {
      admin: 'danger',
      teacher: 'primary',
      student: 'success'
    };
    return colors[role] || 'medium';
  };

  let lastDate = '';

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Messages</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={loadMessages}>
                <IonIcon icon={refreshOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={contentRef} className="messages-content">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <IonIcon icon={peopleOutline} size="large" />
                <h2>No messages yet</h2>
                <p>Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const messageDate = formatDate(message.createdAt);
                const showDateDivider = messageDate !== lastDate;
                lastDate = messageDate;

                return (
                  <React.Fragment key={message.id}>
                    {showDateDivider && (
                      <div className="date-divider">
                        <span>{messageDate}</span>
                      </div>
                    )}
                    <div className={`message-wrapper ${message.senderId === user?.id ? 'own-message' : 'other-message'}`}>
                      {message.senderId !== user?.id && (
                        <IonAvatar className="message-avatar">
                          {message.senderProfilePicture ? (
                            <img 
                              src={message.senderProfilePicture.startsWith('http') 
                                ? message.senderProfilePicture 
                                : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${message.senderProfilePicture}`
                              } 
                              alt={message.senderUsername}
                              onError={(e: any) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="avatar-placeholder-small"
                            style={{ display: message.senderProfilePicture ? 'none' : 'flex' }}
                          >
                            {message.senderUsername[0].toUpperCase()}
                          </div>
                        </IonAvatar>
                      )}
                      <div className="message-bubble">
                        {message.senderId !== user?.id && (
                          <div className="message-header">
                            <span className="message-sender">{message.senderUsername}</span>
                            <IonBadge color={getRoleBadgeColor(message.senderRole)} className="message-role-badge">
                              {message.senderRole}
                            </IonBadge>
                          </div>
                        )}
                        <p className="message-content">{message.content}</p>
                        <div className="message-footer">
                          <span className="message-time">{formatTime(message.createdAt)}</span>
                          <div className="message-actions">
                            <IonButton 
                              fill="clear" 
                              size="small" 
                              className="reply-button"
                              onClick={() => handleReply(message)}
                            >
                              <IonIcon icon={arrowUndoOutline} slot="icon-only" />
                            </IonButton>
                            {/* Only author or admin can delete */}
                            {(message.senderId === user?.id || user?.role === 'admin') && (
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDeleteClick(message)}
                              >
                                <IonIcon icon={ellipsisVerticalOutline} slot="icon-only" />
                              </IonButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>

          <IonToast
            isOpen={toast.show}
            message={toast.message}
            duration={3000}
            color={toast.color}
            onDidDismiss={() => setToast({ ...toast, show: false })}
          />

          <IonActionSheet
            isOpen={showDeleteOptions}
            onDidDismiss={() => setShowDeleteOptions(false)}
            header="Delete Message"
            buttons={[
              // Delete for Me - always available when delete button is shown
              {
                text: 'Delete for Me',
                icon: trashOutline,
                handler: handleDeleteForMe
              },
              // Delete for Everyone - ONLY for your own messages
              ...(selectedMessage?.senderId === user?.id ? [{
                text: 'Delete for Everyone',
                icon: trashOutline,
                role: 'destructive',
                handler: handleDeleteForEveryone
              }] : []),
              {
                text: 'Cancel',
                role: 'cancel'
              }
            ]}
          />
        </IonContent>

        <div className="message-input-container">
          {replyingTo && (
            <div className="reply-indicator">
              <div className="reply-info">
                <IonIcon icon={arrowUndoOutline} />
                <span>Replying to <strong>{replyingTo.senderUsername}</strong></span>
              </div>
              <IonButton fill="clear" size="small" onClick={cancelReply}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </div>
          )}
          <form onSubmit={handleSend} className="message-form">
            <IonItem lines="none" className="message-input-item">
              <IonInput
                value={newMessage}
                onIonInput={(e: any) => setNewMessage(e.target.value)}
                placeholder={replyingTo ? `Reply to ${replyingTo.senderUsername}...` : "Type a message..."}
                disabled={isLoading}
              />
            </IonItem>
            <IonButton
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="send-button"
            >
              <IonIcon icon={sendOutline} />
            </IonButton>
          </form>
        </div>
      </IonPage>
    </>
  );
};

export default Messages;
