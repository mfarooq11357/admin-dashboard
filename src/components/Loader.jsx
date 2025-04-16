//Loader.jsx
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.15); }
`;

const logoGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 8px rgba(42, 77, 142, 0.3)); }
  50% { filter: drop-shadow(0 0 12px rgba(42, 77, 142, 0.5)); }
`;

const subtitleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const SensoryLoader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
`;

const SpinnerRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: ${spin} 1.5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: ${spin} 3s linear infinite !important;
  }
`;

const SpinnerRing1 = styled(SpinnerRing)`
  border: 4px solid rgba(42, 77, 142, 0.2);
  border-top-color: #2a4d8e;
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const SpinnerRing2 = styled(SpinnerRing)`
  width: 130%;
  height: 130%;
  top: -15%;
  left: -15%;
  border: 3px solid transparent;
  border-bottom-color: #2a4d8e;
  animation-direction: reverse;
  animation-duration: 2s;
`;

const RotatingLogo = styled.img`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 1.5s ease-in-out infinite, ${logoGlow} 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(42, 77, 142, 0.3));

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LoaderText = styled.div`
  text-align: center;
  margin-top: 30px;
  position: relative;
`;

const SubText = styled.span`
  font-size: 14px;
  color: #6c757d;
  display: block;
  margin-top: 8px;
  letter-spacing: 1.5px;
  opacity: 0.9;
  animation: ${subtitleFloat} 3s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Loader = () => {
  return (
    <SensoryLoader>
      <LogoContainer>
        <SpinnerRing1 />
        <SpinnerRing2 />
        <RotatingLogo 
          src="https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png" 
          alt="Society Logo"
        />
      </LogoContainer>
      <LoaderText>
        <SubText>Loading....</SubText>
      </LoaderText>
    </SensoryLoader>
  );
};

export default Loader;
