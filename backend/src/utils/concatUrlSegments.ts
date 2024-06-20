const concatUrlSegments = (...segments: string[]) => {
  const path = segments
    .map(segment => segment.replace(/^\/+|\/+$/g, ''))
    .join('/');

  return path;
}

export default concatUrlSegments