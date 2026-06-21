import React from 'react';

interface Props {
  id: number;
}

export default function EzoicAdPlaceholder({ id }: Props) {
  // DO NOT add any styling or reserving space to the actual placeholder div.
  return <div id={`ezoic-pub-ad-placeholder-${id}`}></div>;
}
