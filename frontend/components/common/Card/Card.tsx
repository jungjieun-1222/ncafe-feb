import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export function CardImage({ children, className = '' }: CardProps) {
    return <div className={`${styles.cardImage} ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: CardProps) {
    return <div className={`${styles.cardBody} ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
    return <div className={`${styles.cardFooter} ${className}`}>{children}</div>;
}
