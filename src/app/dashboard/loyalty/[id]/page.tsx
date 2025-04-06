"use client";

import { useParams } from 'next/navigation';
import LoyaltyMemberDetails from './LoyaltyMemberDetails';

export default function LoyaltyMemberPage() {
  const params = useParams();
  const id = params?.id as string;

  return <LoyaltyMemberDetails id={id} />;
} 