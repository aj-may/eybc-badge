import { Badge, PrismaClient } from '@prisma/client';
import { Canvas } from '@react-three/fiber';
import CardViewer from 'components/three/cardViewer';
import { GetServerSideProps, NextPage } from 'next';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenId } = context.query;
  if (!tokenId || typeof tokenId !== 'string')
    return { notFound: true };
  
  const badge = await prisma.badge.findUnique({
    where: {
      tokenId: parseInt(tokenId),
    },
  });

  if (!badge) return { notFound: true };

  return {
    props: { badge },
  }
}

const Page: NextPage<{ badge: Badge}> = ({ badge }) =>
  <div style={{ background: 'black', height: '100vh', width: '100vw'}}>
    <Canvas camera={{ position: [1,0,5]}}>
      <ambientLight intensity={.5}/>
    
      <CardViewer
        text={badge.handle}
        profileImgSrc='/models/defaultProfile.jpg'
      />
    </Canvas>
  </div>;

export default Page
