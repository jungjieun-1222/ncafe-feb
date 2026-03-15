'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';
import { MessageCircle, X, Send, Moon, Sparkles, User as UserIcon } from 'lucide-react';
import { getImageUrl } from '@/utils/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { sendMessageStream } from '@/app/lib/aiAgent';
import { useAuthStore } from '@/stores/useAuthStore';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'menu_card' | 'quick_reply' | 'gender_select';
    content: string;
    metadata?: {
        name: string;
        price: number;
        imageSrc: string;
        description: string;
        categoryName: string;
    };
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

const Avatar = ({ role, gender, size = 'small' }: { role: 'assistant' | 'user', gender?: 'male' | 'female' | null, size?: 'small' | 'large' }) => {
    const isBot = role === 'assistant';
    const className = size === 'large' ? styles.avatarLarge : (isBot ? styles.botAvatarIcon : styles.userAvatarIcon);

    if (isBot) {
        return (
            <div className={className}>
                <Moon size={size === 'large' ? 24 : 18} fill="currentColor" />
            </div>
        );
    }

    return (
        <div className={className} style={{ backgroundColor: gender === 'male' ? '#e3f2fd' : '#fce4ec', color: gender === 'male' ? '#1976d2' : '#c2185b' }}>
            <UserIcon size={size === 'large' ? 24 : 18} />
        </div>
    );
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const user = useAuthStore(state => state.user);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleToolCall = async (toolCall: { name: string, args: Record<string, any> }) => {
        console.log('🤖 AI Tool Call:', toolCall);

        const { name, args } = toolCall;

        switch (name) {
            case 'Maps_to':
                if (args.path) {
                    console.log(`🚀 Navigating to: ${args.path}`);
                    router.push(args.path);
                }
                break;

            case 'add_to_cart':
                if (args.menu_slug) {
                    try {
                        let cartId = localStorage.getItem('cartId');
                        if (!cartId) {
                            cartId = 'guest_' + Date.now().toString();
                            localStorage.setItem('cartId', cartId);
                        }

                        console.log(`🛒 Adding to cart: ${args.menu_slug} (Quantity: ${args.quantity || 1})`);

                        const res = await fetch(`/api/v1/carts/${cartId}/items/by-slug`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                slug: args.menu_slug,
                                quantity: args.quantity || 1,
                                optionIds: [] // Default options
                            })
                        });

                        if (res.ok) {
                            console.log('✅ Successfully added to cart via slug');
                            const { triggerRefresh } = (await import('@/stores/useCartStore')).useCartStore.getState();
                            triggerRefresh();
                            toast.success(`${args.menu_slug} 장바구니에 담았소!`, {
                                icon: '🧺',
                                style: { background: '#f5f5dc', color: '#5d4037', border: '1px solid #d7ccc8' }
                            });
                        } else {
                            console.warn('Failed to add to cart via slug API');
                            toast.error('장바구니에 담지 못했소. 잠시 후 다시 시도해주시게나.');
                        }
                    } catch (err) {
                        console.error('Error in add_to_cart tool execution:', err);
                    }
                }
                break;

            default:
                console.warn(`Unknown tool: ${name}`);
        }
    };

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

        setMessages((prev: Message[]) => [...prev.filter(m => m.type !== 'gender_select'), userMsg, responseMsg]);
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

        setMessages((prev: Message[]) => [...prev, newUserMsg]);
        setInputValue('');

        const messageHistory = messages
            .filter(m => m.type === 'text')
            .map((msg: Message) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

        messageHistory.push({
            role: 'user',
            content: userContent
        });

        const botMessageId = (Date.now() + 1).toString();
        const placeholderBotMsg: Message = {
            id: botMessageId,
            role: 'assistant',
            type: 'text',
            content: ''
        };
        setMessages((prev: Message[]) => [...prev, placeholderBotMsg]);
        setIsThinking(true);

        try {
            let accumulatedContent = '';

            for await (const data of sendMessageStream(messageHistory, user?.id)) {
                if (data.content) {
                    setIsThinking(false);
                    accumulatedContent += (data.content as string);
                    setMessages((prev: Message[]) => prev.map((msg: Message) =>
                        msg.id === botMessageId
                            ? { ...msg, content: accumulatedContent }
                            : msg
                    ));
                } else if (data.menu_cards && data.menu_cards.length > 0) {
                    const cardMessages: Message[] = data.menu_cards.map((card: any, idx: number) => ({
                        id: `${botMessageId}-card-${idx}`,
                        role: 'assistant' as const,
                        type: 'menu_card' as const,
                        content: '',
                        metadata: {
                            name: card.name,
                            price: card.price,
                            imageSrc: card.imageSrc,
                            description: card.description,
                            categoryName: card.categoryName,
                        }
                    }));
                    setMessages((prev: Message[]) => [...prev, ...cardMessages]);
                } else if (data.tool_calls && Array.isArray(data.tool_calls) && data.tool_calls.length > 0) {
                    for (const tool of data.tool_calls) {
                        handleToolCall(tool as { name: string, args: Record<string, any> });
                    }
                } else if (data.function_call) {
                    handleToolCall(data.function_call as { name: string, args: Record<string, any> });
                } else if (data.error) {
                    throw new Error(data.error);
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setIsThinking(false);
            setMessages((prev: Message[]) => prev.map((msg: Message) =>
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
        if (text === '인연 찾아줘' && !user) {
            toast.error('인연을 찾으시려면 먼저 로그인이 필요하오!', { icon: '🔐' });
            return;
        }
        setInputValue(text);
        setTimeout(() => {
            const sendBtn = document.getElementById('chat-send-btn');
            if (sendBtn) sendBtn.click();
        }, 50);
    };

    const renderMessage = (msg: Message) => {
        const isBot = msg.role === 'assistant';

        if (isBot && msg.type === 'text' && !msg.content) {
            return null;
        }

        return (
            <div key={msg.id} className={`${styles.messageWrapper} ${isBot ? styles.bot : styles.user}`}>
                {isBot && msg.type !== 'gender_select' && (
                    <Avatar role="assistant" />
                )}

                {msg.role === 'user' && (
                    <Avatar role="user" gender={gender} />
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
                                src={getImageUrl(msg.metadata.imageSrc)}
                                alt={msg.metadata.name}
                                className={styles.cardImage}
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&auto=format&fit=crop';
                                }}
                            />
                            <div className={styles.cardContent}>
                                <div className={styles.cardTitle}>{msg.metadata.name}</div>
                                <div className={styles.cardPrice}>{msg.metadata.price.toLocaleString()}원</div>
                                <div className={styles.cardActions}>
                                    <button 
                                        className={styles.cardPrimaryAction} 
                                        onClick={() => {
                                            handleToolCall({ name: 'add_to_cart', args: { menu_slug: msg.metadata?.name, quantity: 1 } });
                                            router.push('/cart');
                                        }}
                                    >
                                        바로 주문
                                    </button>
                                    <button 
                                        className={styles.cardSecondaryAction} 
                                        onClick={() => handleToolCall({ name: 'add_to_cart', args: { menu_slug: msg.metadata?.name, quantity: 1 } })}
                                    >
                                        장바구니 담기
                                    </button>
                                </div>
                                <p className={styles.cardFooterText}>
                                    * 나리, 바로 주문하시겠소? 아니면 나중에 더 보시려면 장바구니에 담아두셔도 된다오. 🏮
                                </p>
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
                            <Avatar role="assistant" size="large" />
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
                                <Avatar role="assistant" />
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
