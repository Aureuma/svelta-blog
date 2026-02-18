export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const formatDate = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const calculateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const minutes = Math.max(1, Math.ceil(words.length / 220));
  return {
    minutes,
    wordCount: words.length,
    label: `${minutes} min read`
  };
};
