import type { AppProps } from 'next/app'
import { Canvas } from '@react-three/fiber';
import CardViewer from 'components/three/cardViewer';

function Viewer({ Component, pageProps }: AppProps) {

  return (
    <div style={{ background: 'black', height: '100vh', width: '100vw'}}>
        <Canvas
          camera={{ position: [1,0,5]}}>
            <ambientLight intensity={.5}/>
            {/* <pointLight position={[10, 10, 10]} /> */}
            <CardViewer
              text="PERSONNAME"
              profileImgSrc='/models/defaultProfile.jpg'
              />
        </Canvas>
    </div>
  )
}

export default Viewer
