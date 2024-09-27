import "./App.css";
import "./Card.css";
import React, { useState, useEffect } from "react";
import { JobMetadata, NumberDictionary } from "./interfaces";
import Card from "./Card";

function App() {
  const [ids, setIds] = useState<number[]>([]);
  const [metadatas, setMetadatas] = useState<JobMetadata[]>([]);
  const [jobStartIndex, setJobStartIndex] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<NumberDictionary<boolean>>({});
  const [isAllJobs, setIsAllJobs] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIds();
  }, []);

  useEffect(() => {
    fetchMetaDataForJobs();
  }, [ids, jobStartIndex]);

  const filterJobs = () => {
    if (isAllJobs) {
      return metadatas;
    } else {
      const savedJobs = metadatas.filter((job) => savedJobIds[job.id] === true);
      if (savedJobs.length === 0) {
        return [];
      }
      return savedJobs;
    }
  };

  const handleToggledSavedJob = (jobId: number) => {
    setSavedJobIds((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId],
    }));
  };

  const fetchIds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data with code " + response.status);
      }
      const result: number[] = await response.json();
      setIds(result);
    } catch (err: any) {
      setError(err.message || "An error occured when trying to fetch job ids");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setJobStartIndex(jobStartIndex + 9);
  };

  const fetchMetaDataForJobs = async () => {
    try {
      setIsLoading(true); // Start loading
      setError(null); // Clear any previous errors

      const jobsToFetch = ids.slice(jobStartIndex, jobStartIndex + 9);
      const allMetadata = await Promise.all(
        jobsToFetch.map(async (jobId) => {
          const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch job with ID ${jobId}.`);
          }

          const result: JobMetadata = await response.json();
          return result;
        })
      );
      setMetadatas((prevMetadatas) => [...prevMetadatas, ...allMetadata]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Hacker Jobs Plus</h2>
      <p>
        Browse the lastest YC jobs from HackerNews without feeling overwhelmed
        and having to squint
      </p>
      <button onClick={() => setIsAllJobs(false)}>
        <i className="fas fa-heart" />
        Saved Jobs
        {Object.values(savedJobIds).filter((value) => value === true).length}
      </button>
      <button onClick={() => setIsAllJobs(true)}>All Jobs</button>
      {isLoading && <div>Loading...</div>}

      {error && <div>Error: {error}</div>}

      {!isAllJobs &&
        Object.values(savedJobIds).filter((val) => val === true).length ==
          0 && <div>No Saved Jobs</div>}

      {!isLoading && !error && (
        <div className="card-container">
          {filterJobs().map((job) => (
            <Card
              handleToggledSavedJob={handleToggledSavedJob}
              savedJobIds={savedJobIds}
              job={job}
              key={job.id}
            />
          ))}
        </div>
      )}
      {isAllJobs && <button onClick={handleLoadMore}>Load More</button>}
    </div>
  );
}

export default App;
