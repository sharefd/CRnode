const ChevronLeft = ({ setShowForm }) => {
  return (
    <div>
      <button
        onClick={() => setShowForm(false)}
        data-toggle-signup-form-btn=''
        data-back-btn=''
        className='btn2 btn2--tertiary btn2--circle back-btn'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='6'
          height='10'
          viewBox='0 0 6 10'
          fill='none'
          role='img'
          aria-labelledby='a680s2vtw5rf8sl0j7d71dbv3ggknc2g'>
          <title id='a680s2vtw5rf8sl0j7d71dbv3ggknc2g'>Icons/chevron left</title>
          <path d='M6 1.175L4.8583 0L0 5L4.8583 10L6 8.825L2.2915 5L6 1.175Z' fill='#0d0c22'></path>
        </svg>
      </button>
    </div>
  );
};
export default ChevronLeft;
