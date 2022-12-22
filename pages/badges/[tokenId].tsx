import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GetServerSideProps } from "next";
import { PrismaClient, Badge } from "@prisma/client";
import BadgeMesh from "components/badgeMesh";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenId } = context.query;

  if (!tokenId || typeof tokenId !== "string") return { notFound: true };

  const badge = await prisma.badge.findUnique({
    where: {
      id: tokenId,
    },
  });

  if (!badge) return { notFound: true };

  return {
    props: { badge },
  };
};

type PageProps = {
  badge: Badge;
};

export default function Page({ badge }: PageProps) {
  return (
    <Box h="100vh" bgColor="black">
      <Canvas camera={{ position: [0, 0, -10] }}>
        <ambientLight intensity={0.9} />
        <OrbitControls autoRotate />
        <BadgeMesh {...badge} />
      </Canvas>
    </Box>
  );
}
