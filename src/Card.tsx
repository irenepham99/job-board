import React from "react";
import { JobMetadata, NumberDictionary } from "./interfaces";
import "./Card.css";

interface CardProps {
  job: JobMetadata;
  handleToggledSavedJob: Function;
  savedJobIds: NumberDictionary<Boolean>;
}

const Card = ({ job, handleToggledSavedJob, savedJobIds }: CardProps) => {
  return (
    <div className="card" key={job.id}>
      <div className="card-element">
        {job.title.match(/.*\)/) == null
          ? job.title.match(/^[^\s]+/)
          : job.title.match(/.*\)/)}
        <br />
        <br />
      </div>
      <div className="card-element">
        {job.title.match(/.*\)/) == null
          ? job.title.match(/\s(.*)/)?.[0]
          : job.title.match(/(?<=\))\s*(.*)/)?.[0]}
        <br />
        <br />
      </div>
      <div className="card-element">
        {new Date(job.time * 1000).toLocaleDateString()}
        <br />
        <br />
      </div>
      <div className="button-bar">
        <button onClick={() => window.open(job.url, "_blank")}>
          Apply Now!
        </button>
        <button onClick={() => handleToggledSavedJob(job.id)}>
          <i
            className={
              savedJobIds[job.id] === true ? "fas fa-heart" : "far fa-heart"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
