import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/layout'
import Upload from './upload'

const Home: NextPage = () => {
  return (
    <div >
      <Head>
        <title>JPG to Word</title>
      </Head>
      <Layout>
        <Upload/>
      </Layout>
    </div>
  )
}

export default Home
