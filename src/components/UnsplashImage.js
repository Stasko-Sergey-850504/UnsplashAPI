import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: 80%;
  height: 80%;
  object-fit: cover;
`;

const UnsplashImage = ({url}) => {
    return <Img src={url} alt=""/>;
};

export default UnsplashImage;