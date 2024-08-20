const LoadingSpinner = () => {
  return (
    <div className={'mt-5'}>
      <div className="spinner-border text-primary" role="status"/>
      <p className={'text-sm font-bold mt-3'}>We are checking your site. Please wait for a moment...</p>
    </div>
  )
}

export default LoadingSpinner