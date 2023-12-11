import DrawingBoard from '@/components/DrawingBoard';

export default function Home() {
  return (
    <div className='container mx-auto'>
      <h1 className='text-center text-2xl font-bold my-4'>Drawing App</h1>
      <DrawingBoard />
    </div>
  );
}
