'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
    const [isbn, setIsbn] = useState('');

    // 학적 정보 상태
    const [grade, setGrade] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');

    const [report, setReport] = useState('');
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formatPubDate = (date) => {
        if (!date || date.length !== 8) return date;
        return `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)}.`;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!isbn) return;

        setLoading(true);
        setError('');

        try {
            const cleanIsbn = isbn.replace(/-/g, '').trim();

            const res = await fetch(`/api/search?isbn=${cleanIsbn}`);
            const data = await res.json();

            if (!res.ok) {
                setBook(null);
                throw new Error(data.error || '도서 정보를 불러올 수 없습니다.');
            }

            setBook(data);
        } catch (err) {
            setError(err.message || '검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>

                {/* 1. 최상단 학적 정보 입력란 */}
                <div className={styles.studentInfoBar}>
                    <div className={styles.studentInfoItem}>
                        <input
                            type="text"
                            className={styles.smallInput}
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                        <span className={styles.studentLabel}>학년</span>
                    </div>
                    <div className={styles.studentInfoItem}>
                        <input
                            type="text"
                            className={styles.smallInput}
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                        />
                        <span className={styles.studentLabel}>반</span>
                    </div>
                    <div className={styles.studentInfoItem}>
                        <input
                            type="text"
                            className={styles.smallInput}
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <span className={styles.studentLabel}>번</span>
                    </div>
                    <div className={styles.studentInfoItem} style={{ marginLeft: '15px' }}>
                        <span className={styles.studentLabel}>이름</span>
                        <input
                            type="text"
                            className={styles.smallInput}
                            style={{ width: '120px' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. Middle Section: Book Info Table (Left) + Thumbnail (Right) */}
                <div className={styles.middleSection}>

                    {/* Left Column Wrapper (aligns content to bottom) */}
                    <div className={styles.bookInfoWrapper}>
                        {/* The Actual Visible Table */}
                        <div className={styles.bookInfoTable}>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>ISBN</div>
                                <div className={styles.inputCell}>
                                    <form onSubmit={handleSearch} className={styles.searchRow}>
                                        <input
                                            type="text"
                                            className={styles.inputField}
                                            placeholder="ISBN 입력 (예: 9788932917245)"
                                            value={isbn}
                                            onChange={(e) => setIsbn(e.target.value)}
                                        />
                                        <button type="submit" className={styles.searchButton} disabled={loading}>
                                            {loading ? '검색중' : '검색'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.labelCell}>책 제목</div>
                                <div className={styles.inputCell}>
                                    <span className={styles.infoText}>{book ? book.title : ''}</span>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.labelCell}>저자</div>
                                <div className={styles.inputCell}>
                                    <span className={styles.infoText}>{book ? book.author : ''}</span>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.labelCell}>출판사</div>
                                <div className={styles.inputCell}>
                                    <span className={styles.infoText}>{book ? book.publisher : ''}</span>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.labelCell}>출판일</div>
                                <div className={styles.inputCell}>
                                    <span className={styles.infoText}>{book ? formatPubDate(book.pubdate) : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Thumbnail */}
                    <div className={styles.thumbnailSection}>
                        {book ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={book.image}
                                alt={book.title}
                                className={styles.bookImage}
                            />
                        ) : (
                            <div className={styles.thumbnailPlaceholder}>(섬네일 불러오기)</div>
                        )}
                    </div>

                </div>

                {/* 3. Bottom Section: Reading Report */}
                <div className={styles.reportRow}>
                    <div className={styles.reportLabel}>독서감상문 작성필드</div>
                    <textarea
                        className={styles.reportTextarea}
                        placeholder="내용을 입력하세요..."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                </div>

                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
}
