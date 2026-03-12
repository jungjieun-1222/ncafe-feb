'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'menu_card' | 'quick_reply' | 'gender_select';
    content: string;
    metadata?: any;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        type: 'text',
        content: '허허~ 어서 오시게나! 🏮\n이곳은 지친 마음을 쉬어가는 엔카페라오. 향긋한 차 한 잔의 여유는 물론, 사랑스러운 반려견들도 함께할 수 있는 곳이지요. 🐾\n\n나에게 말을 걸기 전에, 나리께서는 선비님이신가 아니면 아씨님이신가 알려주실 수 있겠소?'
    },
    {
        id: '2',
        role: 'assistant',
        type: 'gender_select',
        content: ''
    }
];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleGenderSelect = (selected: 'male' | 'female') => {
        setGender(selected);
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            type: 'text',
            content: selected === 'male' ? '저는 선비입니다.' : '저는 아씨입니다.'
        };

        const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            type: 'text',
            content: selected === 'male'
                ? '호오~ 선비님이셨구려! 반갑소이다. 궁금한 게 있다면 무엇이든 물어보시게나!'
                : '아씨님이셨구려! 참으로 곱소이다. 궁금한 게 있다면 무엇이든 물어보시게나!'
        };

        setMessages(prev => [...prev.filter(m => m.type !== 'gender_select'), userMsg, responseMsg]);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || !gender) return;

        const userContent = inputValue;
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            type: 'text',
            content: userContent
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Prepare message history for API (map 'assistant' to 'model')
        const messageHistory = messages
            .filter(m => m.type === 'text')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

        // Add current user message
        messageHistory.push({
            role: 'user',
            content: userContent
        });

        // Add placeholder bot message for streaming
        const botMessageId = (Date.now() + 1).toString();
        const placeholderBotMsg: Message = {
            id: botMessageId,
            role: 'assistant',
            type: 'text',
            content: ''
        };
        setMessages(prev => [...prev, placeholderBotMsg]);
        setIsThinking(true);

        try {
            const response = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messageHistory,
                    stream: true
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to AI server');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                setIsThinking(false);
                                accumulatedContent += data.content;
                                let displayContent = accumulatedContent;
                                setMessages(prev => prev.map(msg =>
                                    msg.id === botMessageId
                                        ? { ...msg, content: displayContent }
                                        : msg
                                ));
                            } else if (data.menu_cards && data.menu_cards.length > 0) {
                                // Add menu card messages after the text message
                                const cardMessages: Message[] = data.menu_cards.map((card: any, idx: number) => ({
                                    id: `${botMessageId}-card-${idx}`,
                                    role: 'assistant' as const,
                                    type: 'menu_card' as const,
                                    content: '',
                                    metadata: {
                                        name: card.name,
                                        price: card.price,
                                        imageSrc: card.imageSrc ? card.imageSrc.replace(/^\/images\//, '') : '',
                                        description: card.description,
                                        categoryName: card.categoryName,
                                    }
                                }));
                                setMessages(prev => [...prev, ...cardMessages]);
                            } else if (data.error) {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            // Only log actual parse errors, not menu_card processing
                            if (!(e instanceof SyntaxError)) {
                                console.error('Error processing SSE data', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setIsThinking(false);
            setMessages(prev => prev.map(msg =>
                msg.id === botMessageId
                    ? { ...msg, content: '죄송하오, 나리. 서역 너머의 기운이 불안정하여 대답을 드릴 수 없게 되었소. 잠시 후 다시 여쭤봐 주시겠소? (서버 연결 실패 🏮)' }
                    : msg
            ));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickReply = (text: string) => {
        setInputValue(text);
        setTimeout(() => {
            const sendBtn = document.getElementById('chat-send-btn');
            if (sendBtn) sendBtn.click();
        }, 50);
    };

    const renderMessage = (msg: Message) => {
        const isBot = msg.role === 'assistant';

        // 봇 메시지이고 아직 내용이 없는 경우(생각 중인 경우) 중복 표시를 막기 위해 표시하지 않음
        if (isBot && msg.type === 'text' && !msg.content) {
            return null;
        }

        return (
            <div key={msg.id} className={`${styles.messageWrapper} ${isBot ? styles.bot : styles.user}`}>
                {isBot && msg.type !== 'gender_select' && (
                    <img
                        src="/images/wolha.png"
                        alt="월하선생"
                        className={styles.botAvatarImage}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=40px&auto=format&fit=crop';
                        }}
                    />
                )}

                {msg.role === 'user' && (
                    <img
                        src={gender === 'male' ? '/images/user_male.png' : '/images/user_female.png'}
                        alt="사용자"
                        className={styles.userAvatarImage}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User';
                        }}
                    />
                )}

                <div style={{ flex: 1 }}>
                    {msg.type === 'gender_select' ? (
                        <div className={styles.genderSelectContainer}>
                            <button onClick={() => handleGenderSelect('male')} className={styles.genderBtn}>저는 선비입니다 (남)</button>
                            <button onClick={() => handleGenderSelect('female')} className={styles.genderBtn}>저는 아씨입니다 (여)</button>
                        </div>
                    ) : (
                        msg.content && (
                            <div className={styles.messageBubble}>
                                {msg.content}
                            </div>
                        )
                    )}

                    {msg.type === 'menu_card' && msg.metadata && (
                        <div className={styles.cardContainer}>
                            <img
                                src={msg.metadata.imageSrc ? `/images/${msg.metadata.imageSrc}` : 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&auto=format&fit=crop'}
                                alt={msg.metadata.name}
                                className={styles.cardImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&auto=format&fit=crop';
                                }}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardTitle}>{msg.metadata.name}</div>
                                <div className={styles.cardPrice}>{msg.metadata.price.toLocaleString()}원</div>
                                <button className={styles.cardAction} onClick={() => alert('주문 API 연동 전입니다.')}>주문하기</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.chatWidgetContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <div className={styles.headerInfo}>
                            <img src="/images/wolha.png" alt="월하선생 프로필" className={styles.avatarImage} />
                            <div>
                                <h3 className={styles.title}>월하선생</h3>
                                <p className={styles.subtitle}>엔카페 터줏대감 중매쟁이</p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className={styles.messagesContainer}>
                        {messages.map(renderMessage)}
                        {isThinking && (
                            <div className={`${styles.messageWrapper} ${styles.bot}`}>
                                <img
                                    src="/images/wolha.png"
                                    alt="월하선생"
                                    className={styles.botAvatarImage}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=40px&auto=format&fit=crop';
                                    }}
                                />
                                <div className={styles.thinkingBubble}>
                                    <span className={styles.thinkingText}>월하선생님께서 생각중이오</span>
                                    <div className={styles.dot}></div>
                                    <div className={styles.dot}></div>
                                    <div className={styles.dot}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className={styles.messagesEnd} />
                    </div>

                    <div style={{ padding: '0 16px', display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '8px', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        <button
                            onClick={() => handleQuickReply('추천 메뉴 알려줘')}
                            style={{ whiteSpace: 'nowrap', padding: '6px 12px', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-200)', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            음료 추천 차림표 🍵
                        </button>
                        <button
                            onClick={() => handleQuickReply('인연 찾아줘')}
                            style={{ whiteSpace: 'nowrap', padding: '6px 12px', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-200)', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            합환주 인연 찾기 🏮
                        </button>
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            placeholder="월하선생에게 말 걸기..."
                            className={styles.input}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            id="chat-send-btn"
                            className={styles.sendBtn}
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className={styles.floatingBtn} onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                    <span className={styles.badge}>N</span>
                </button>
            )}
        </div>
    );
}
