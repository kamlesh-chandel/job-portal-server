vi.mock('../src/config/cloudinary.js', () => {
  return {
    default: {
      uploader: {
        upload_stream(config, callback) {
          return {
            end() {
              callback(null, {
                secure_url: 'https://fake-cloudinary-url.com/file',
              });
            },
          };
        },
      },
    },
  };
});
