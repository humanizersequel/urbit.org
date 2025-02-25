import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import classnames from "classnames";
import React from "react";
import { DateTime } from "luxon";
import {
  Container,
  Section,
  SingleColumn,
  TwoUp,
  IntraNav,
  getAllPosts,
  generateRealtimeDate,
  getPage,
  Markdown,
  getPreviousPost,
  getNextPost,
} from "@urbit/foundation-design-system";
import { getAllEvents } from "../../lib/lib";
import { join } from 'path';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Contact from "../../components/Contact";
import PostPreview from "../../components/PostPreview";
import EventPreview from "../../components/EventPreview";
import Sidebar from "../../components/Sidebar";
import { eventKeys } from "../../lib/constants";
import IndexCard from "../../components/ecosystem/IndexCard";
import HighlightCard from "../../components/HighlightCard";
import fs from "fs";
import path from "path";
import Meta from "../../components/Meta";
import campusTree from "../../cache/campus.json";
import { matchEcosystemPost } from "../../lib/lib";

export default function Home({
  posts,
  highlights,
  ecosystem,
  events,
  grantNumbers,
  search,
  data,
  markdown,
}) {
  const post = {
    title: "Urbit",
    description: "A clean-slate OS and network for the 21st century.",
    image: "https://storage.googleapis.com/media.urbit.org/site/opengraph/urbit.png"
  };
  return (
    <Container>
      <Head>
        <title>Urbit</title>
        {Meta(post, false, true)}
      </Head>
      <IntraNav ourSite="https://urbit.org" search={search} />
      
        <SingleColumn>
            <Header search={search} />

            {/* Hero statement */}
            <Section className="pb-6">      
                <div className="flex flex-col space-y-4">
                    <h1 className="max-w-prose">
                      Campus Outreach Program
                    </h1>
                    <h3 className="">
                      Leave your mark on the future. Build on Urbit. 
                    </h3>
                </div>
            </Section>

            

            {/* Brief explanatory paragraph */}
            <Section className="sm:flex sm:space-x-8 space-y-8 sm:space-y-0">
   
                <div className="sm:w-2/3 space-y-8">
                    <div className="space-y-4">
                      <p className="type-ui">
                      For those with the will to think outside the box: a complete reimagining of networked computing from the OS up, designed to facilitate the construction 
                      of powerful, enduring, and decentralized systems.
                      </p>
                      <p className="type-ui">
                      The Urbit Foundation’s Campus Outreach Program aims to find ambitious students interested in leaving the old 
                      world behind and providing them with the information and resources to help build a better future. 
                      If you fit that description and want us to come to your university,{" "}
                      <Link href="/campus#contact" passHref>
                      <a>get in touch.</a>
                      </Link>{" "}
                      </p>
                    </div>

                </div>

                <div className="sm:w-1/3">

                  <Link href="https://airtable.com/shrmfUVpMskWw145u" passHref>
                    <a className="button-lg bg-green-400 text-white type-ui max-w-fit">
                      Get on Urbit
                    </a>
                  </Link>

                </div>
            </Section>

            {/* 
              how to make an in-page link (href to hashtag element id)
              <a href="#events"> cheebo </a> 
            */}
            
        

            {
              //funnel, repurposed from /overview page:
            }
            <div id="reading"></div>

            <Section> 

              <h2 className="pb-16">Learn about Urbit for</h2>

              <div className="flex justify-between sidebar md:space-x-8">
                <Sidebar search={search}>
                {childPages("/campus", posts.pages)}
                </Sidebar>
                <div className={'markdown max-w-prose ' + data.slug }>
                  <Markdown.render content={JSON.parse(markdown)} />
                </div>
              </div>
            </Section>

            

            {
                //Events
            }

            <Section className="pb-1">
                
                <br></br>
                <div className="mt-6">
                    <h2 className="mb-8" id="events">Events</h2>
                    {events.length > 0 ? (
                        <TwoUp>
                            <EventPreview event={events[0]} className="mb-8" />
                            {events[1] ? <EventPreview event={events[1]} className="mb-8" /> : <div />}
                        </TwoUp>
                    ) : (
                        <p className="pb-8">No events yet — check back later.</p>
                    )}
                    <Link href="/events?tag=campus">
                        <a className="bg-wall-600 text-white button-lg w-fit">
                            View All
                        </a>
                    </Link>
                </div>
            </Section>

            <div id="contact"></div>

            <Section className="pb-12">
              
              <div className="bg-wall-100 w-full p-4 md:p-8 rounded-3xl flex flex-wrap items-center">

                <div className="sm:pl-2 align-middle">
                  <h2 className=" text-2xl pb-2" >Get in touch</h2 >
                  <p className="max-w-prose pb-4">
                    Not sure how to get started after attending an event? Want to schedule one at your university? 
                    Don't be a stranger. Reach out at the email below, or{" "}
                    <Link href="https://urbit.org/groups/~tidren-nosryg/campus-outreach" passHref>
                    <a>find us on Urbit.</a>
                    </Link>{" "}
                  </p>
                  <Link href="mailto:campus@urbit.org">
                    <a className="button-sm border-2 border-wall-600 text-wall-600 type-sm max-w-fit">
                      campus@urbit.org
                    </a>
                  </Link>
                </div>
              </div>
            </Section>

        


        </SingleColumn>
      
      

      <Footer />
    </Container>
  );
}

const childPages = (thisLink, children, level = 0) => {
  const router = useRouter();

  const isThisPage = router.asPath === thisLink || router.asPath === `${thisLink}#reading`;

  const pageItemClasses = classnames({
    "text-base type-ui": level === 0,
    "text-wall-400": !isThisPage,
    "text-black": isThisPage,
  });
  return (
    <ul className="">
      <li className="pb-2">
        <Link href="/campus#reading">
          <a className={`${pageItemClasses} cursor-pointer`}>Software Developers</a>
        </Link>
      </li>
      {children?.map((child) => (
        <li className="pb-2">
          {pageTree(join(thisLink, child.slug), child, level)}
        </li>
      ))}
    </ul>
  );
};

const pageTree = (thisLink, tree, level = 0) => {
  const router = useRouter();

  
  const isThisPage = router.asPath.includes(thisLink);

  const pageItemClasses = classnames({
    "text-base type-ui": level === 0,
    "text-wall-400": !isThisPage,
    "text-black": isThisPage,
  });

  return (
    <>
      <Link href={thisLink + "#reading"}>
        <a className={`${pageItemClasses} cursor-pointer`}>{tree.title}</a>
      </Link>
    </>
  );
};

export async function getStaticPaths() {
  const posts = campusTree;

  const slugs = [];

  const allHrefs = (thisLink, tree) => {
    slugs.push(thisLink, ...tree.pages.map((e) => join(thisLink, e.slug)));
    allHrefsChildren(thisLink, tree.children);
  };

  const allHrefsChildren = (thisLink, children) => {
    Object.entries(children).map(([childSlug, child]) => {
      allHrefs(join(thisLink, childSlug), child);
    });
  };

  allHrefs("/campus", posts);

  return {
    paths: slugs,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const posts = campusTree;

  const { data, content } = getPage(
    join(process.cwd(), "content/campus", params.slug?.join("/") || "/")
  );
  const markdown = JSON.stringify(Markdown.parse({ post: { content } }));

  const previousPost =
    getPreviousPost(
      params.slug?.slice(-1).join("") || "campus",
      ["title", "slug", "weight"],
      join("campus", params.slug?.slice(0, -1).join("/") || "/"),
      "weight"
    ) || null;

  const nextPost =
    getNextPost(
      params.slug?.slice(-1).join("") || "campus",
      ["title", "slug", "weight"],
      join("campus", params.slug?.slice(0, -1).join("/") || "/"),
      "weight"
    ) || null;

  const allEvents = getAllEvents(eventKeys, "events");
  const events = allEvents.filter((e) => e?.tags?.includes("campus")) || [];

  return { props: { posts, data, markdown, params, previousPost, nextPost, events } };
}



/* export async function getStaticProps() {
    

    const events = getAllEvents(eventKeys, "events").filter((e) => e?.tags?.includes("campus"));

    // const { data, content } = getPage(join(process.cwd(), 'content', 'bitcoin'));

    return {
        props: {
            events
        }
    }
}
 */
