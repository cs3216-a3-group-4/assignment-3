const PlaceholderImage = ({ classname }: { classname?: string }) => {
    return (
      <div className="flex flex-wrap place-content-center bg-gray-100 w-full h-full p-1">
        <div className="flex h-1/2">
          <svg
            className={`${classname} h-full w-full`}
            fill="none"
            viewBox="0 0 132 132"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.9999 89.2632C37.4999 83 44.5177 73.9921 52.4998 72C62.5172 69.5 76.2429 75.8588 80.7928 89.2632C85.5774 103.359 78.7019 118.625 64.7614 123.846C51 129 40 127 28.5002 121C10.4065 111.56 2.49991 89.2632 6.76136 65.8462C16.0139 15.0025 112.563 -19.2824 122.761 27.3462C126.936 46.4359 109.5 58.5 100.793 77.2632C97.0116 85.4107 96.7925 93.0265 98.7925 99.7632C100.793 106.5 106.481 115.119 117 118.5"
              stroke="#D1D5DB"
              strokeLinecap="round"
              strokeWidth="7"
            />
            <path
              d="M90.5395 31.7036C88.9019 35.0846 89.6241 38.4518 92.2096 41.1771C95.6087 44.76 101.735 45.0045 104.856 41.1771C107.401 38.056 107.271 34.0871 104.856 30.8643C101.497 26.3827 92.9808 26.6632 90.5395 31.7036Z"
              fill="#D1D5DB"
            />
          </svg>
        </div>
      </div>
    );
  };
  
  export default PlaceholderImage;
  