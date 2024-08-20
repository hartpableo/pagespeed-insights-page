const SpeedIndex = ({ speedIndex }) => {
  let scoreColor;

  if (speedIndex >= 4.4 && speedIndex <= 5.8) {
    scoreColor = 'text-warning';
  } else if (speedIndex > 5.8) {
    scoreColor = 'text-danger';
  } else {
    scoreColor = 'text-success';
  }

  return (
    <>
      <p className={'font-bold mb-1'}>Speed Index</p>
      <p className={`display-3 font-bold ${scoreColor}`}>{speedIndex}</p>

      {scoreColor === 'text-success' && (
        <p className={'text-sm'}>Great job! Your website is fast.</p>
      )}

      {scoreColor === 'text-warning' && (
        <p className={'text-sm'}>Your website is a bit slow. Try optimizing it.</p>
      )}

      {scoreColor === 'text-danger' && (
        <p className={'text-sm'}>Your website is too slow. Optimize it immediately!</p>
      )}

      {(scoreColor === 'text-danger' || scoreColor === 'text-warning') && (
        <p className={'font-bold'}>
          Contact us and we will help you improve your website health!
        </p>
      )}
    </>
  );
};

export default SpeedIndex;
