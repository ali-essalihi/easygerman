interface Props {
  ytVideoId: string
}

export default function YoutubeEmbed({ ytVideoId }: Props) {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
  }

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '0',
  }

  return (
    <div className="bg-gray-200" style={containerStyle}>
      <iframe
        src={`https://www.youtube.com/embed/${ytVideoId}?rel=0`}
        style={iframeStyle}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
