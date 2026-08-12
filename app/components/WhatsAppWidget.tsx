const WHATSAPP_NUMBER = '201000000000'; // TODO: replace with the real business number

export default function WhatsAppWidget() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed', bottom: 24, right: 88, zIndex: 40,
        width: 52, height: 52, borderRadius: '50%', background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(0,0,0,.18)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.44 1.32 4.94L2 22l5.31-1.39a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Z" opacity="0" />
        <path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.51-.07-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.51h-.56c-.2 0-.51.07-.78.37-.26.29-1.02 1-1.02 2.43s1.05 2.82 1.19 3.02c.15.2 2.06 3.14 4.99 4.4.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
      </svg>
    </a>
  );
}
