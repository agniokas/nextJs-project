import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of meetup places'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  //fetch data from API
  const client = await MongoClient.connect(
    'mongodb+srv://agniokas:WinterIsC0ming@cluster0.p4pnk.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //number means seconds how often the page shpould be updated
  };
}

// export async function getServerSideProps(context) {
//   const request = context.req
//   const response = context.res
//   // fetch data from an API
//   return {
//     props: DUMMY_MEETUPS
//   }
// }

export default HomePage;
