// src/components/ui/NextButton.tsx
import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import Link from 'next/link';

type NextButtonProps = Omit<ButtonProps, 'as'> & {
  href: string;
  children: React.ReactNode;
};

export const NextButton: React.FC<NextButtonProps> = ({
  href,
  children,
  ...btnProps
}) => (
  <Link href={href} passHref>
    {/* Le Button rend <a> automatiquement */}
    <Button as="a" {...btnProps}>
      {children}
    </Button>
  </Link>
);
