import { ChevronDown } from 'lucide-react';
import { ClayRing } from './Clay';
import { OrgLogo } from './Logos';
import { initials, type Contact } from './orgs';

/** A contact's headshot, or their initials until there is one, with the organisation's emblem pinned to the corner when asked. */
export function Avatar({ contact, size = 44, orgId }: { contact: Contact; size?: number; orgId?: string }) {
  return <span className="ac-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
    {contact.photo ? <img src={contact.photo} alt=""/> : <span aria-hidden="true">{initials(contact.name)}</span>}
    {orgId && <OrgLogo id={orgId} size={Math.max(22, Math.round(size * 0.36))} className="ac-avatar-badge"/>}
  </span>;
}

/** The person at the organisation, in their own words. The whole of what they said is a click away when there is more. */
export function ContactCard({ contact, orgId, orgName }: { contact: Contact; orgId: string; orgName: string }) {
  const first = contact.name.split(' ')[0];
  return <figure className="ac-contact">
    <div className="ac-contact-who">
      <ClayRing size={84} pad={8}><Avatar contact={contact} size={84} orgId={orgId}/></ClayRing>
      <figcaption><strong>{contact.name}</strong><span>{contact.role}, {orgName}</span></figcaption>
    </div>
    <blockquote className="ac-contact-quote"><p>“{contact.quote}”</p></blockquote>
    {contact.transcript && <details className="ac-contact-more">
      <summary>Read what {first} said <ChevronDown size={15}/></summary>
      {contact.transcript.map((line) => <p key={line}>{line}</p>)}
    </details>}
  </figure>;
}
