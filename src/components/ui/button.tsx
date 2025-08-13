'use client';
import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 text-white ${props.className ?? ''}`.trim()}
    />
  );
}
