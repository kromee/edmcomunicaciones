type ContactLike = {
  status: 'new' | 'contacted' | 'closed' | string;
  follow_up_date?: string | null;
};

export function isFollowUpDue(contact: ContactLike): boolean {
  if (!contact.follow_up_date || contact.status === 'closed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${contact.follow_up_date}T12:00:00`);
  return due.getTime() <= today.getTime();
}

/** Lead nuevo o seguimiento con fecha hoy o vencida. */
export function contactNeedsAttention(contact: ContactLike): boolean {
  return contact.status === 'new' || isFollowUpDue(contact);
}

export function countContactsNeedingAttention<T extends ContactLike>(
  contacts: T[]
): number {
  return contacts.filter(contactNeedsAttention).length;
}
