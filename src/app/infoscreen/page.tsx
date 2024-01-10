import { RenderStation } from '../../components/renderStation';


type Props = {
  station: string ;
};

export default async function Page(props: Props) {
  const { station } = props;

  if (!station) {
    return (
      <>
        <div>No station provided.</div>
      </>
    );
  }

  

  return (
    <>
      <RenderStation stationId={station}/>
    </>
  );
}
