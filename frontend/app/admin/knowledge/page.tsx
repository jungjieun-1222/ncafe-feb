'use client';

import React, { useState, useEffect } from 'react';
import styles from './knowledge.module.css';

interface KnowledgeItem {
    id: number;
    content: string;
    embedding?: number[];
}

interface SearchResult {
    id: number;
    content: string;
    distance: number;
}

const AGENT_SERVER_URL = process.env.NEXT_PUBLIC_AGENT_SERVER_URL || 'http://localhost:8112';

export default function KnowledgeManager() {
    const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
    const [newContent, setNewContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch all knowledge on mount
    useEffect(() => {
        fetchKnowledge();
    }, []);

    const fetchKnowledge = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${AGENT_SERVER_URL}/knowledge/`);
            if (res.ok) {
                const data = await res.json();
                setKnowledgeList(data);
            }
        } catch (error) {
            console.error('Failed to fetch knowledge:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!newContent.trim()) return;
        
        setIsLoading(true);
        try {
            const res = await fetch(`${AGENT_SERVER_URL}/knowledge/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent }),
            });
            if (res.ok) {
                setNewContent('');
                fetchKnowledge();
                alert('지식이 성공적으로 등록되었습니다.');
            }
        } catch (error) {
            console.error('Failed to register knowledge:', error);
            alert('등록에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch(`${AGENT_SERVER_URL}/knowledge/upload`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSelectedFile(null);
                const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                
                fetchKnowledge();
                alert('파일 내용이 성공적으로 등록되었습니다.');
            } else {
                const errorData = await res.json();
                alert(`업로드 실패: ${errorData.detail || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error('File upload failed:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`${AGENT_SERVER_URL}/knowledge/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchKnowledge();
            }
        } catch (error) {
            console.error('Failed to delete knowledge:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`${AGENT_SERVER_URL}/knowledge/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery, top_k: 3 }),
            });
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>RAG 지식 관리 (Knowledge Management)</h1>
                <p className={styles.subtitle}>챗봇의 답변 근거가 되는 지식 데이터를 관리합니다.</p>
            </header>

            <div className={styles.grid}>
                {/* Registration Section */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>새 지식 등록</h2>
                    
                    <div className={styles.registerForm}>
                        <h3 className={styles.sectionTitle}>직접 입력</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="지식 내용을 입력하세요..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows={3}
                        />
                        <button 
                            className={styles.buttonPrimary} 
                            onClick={handleRegister}
                            disabled={isLoading || !newContent.trim()}
                        >
                            {isLoading ? '등록 중...' : '텍스트 등록'}
                        </button>
                    </div>

                    <div className={styles.divider}>
                        <span className={styles.dividerText}>또는 (OR)</span>
                    </div>

                    <div className={styles.fileUploadSection}>
                        <h3 className={styles.sectionTitle}>파일 업로드 (.txt)</h3>
                        <div className={styles.fileInputWrapper}>
                            <input
                                type="file"
                                id="fileUpload"
                                accept=".txt"
                                className={styles.fileInput}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <button
                                className={styles.buttonSecondary}
                                onClick={handleFileUpload}
                                disabled={isLoading || !selectedFile}
                            >
                                {isLoading ? '업로드 중...' : '파일로 대량 등록'}
                            </button>
                        </div>
                        <p className={styles.helperText}>※ 빈 줄(Enter 2번) 기준으로 지식이 분할되어 저장됩니다.</p>
                    </div>
                </section>

                {/* Search Test Section */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>검색 테스트</h2>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="사용자 질문을 시뮬레이션 하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            className={styles.buttonSecondary}
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            검색
                        </button>
                    </div>

                    <div className={styles.resultsList}>
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div key={result.id} className={styles.resultItem}>
                                    <div className={styles.resultDistance}>
                                        유사도 거리: {result.distance.toFixed(4)}
                                    </div>
                                    <p className={styles.resultContent}>{result.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyText}>검색 결과가 여기에 표시됩니다.</p>
                        )}
                    </div>
                </section>
            </div>

            {/* List Table Section */}
            <section className={styles.listSection}>
                <h2 className={styles.cardTitle}>등록된 지식 목록 ({knowledgeList.length})</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>지식 내용 (Content)</th>
                                <th style={{ width: '120px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {knowledgeList.length > 0 ? (
                                knowledgeList.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td className={styles.truncatedContent}>{item.content}</td>
                                        <td>
                                            <button 
                                                className={styles.buttonDelete}
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className={styles.emptyTable}>등록된 지식이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
