import { JobMetadata, NumberDictionary } from "./interfaces";
import "./Card.css";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // Import solid heart
import { faHeart as outlineHeart } from "@fortawesome/free-regular-svg-icons"; // Import regular heart

interface CardProps {
  job: JobMetadata;
  handleToggledSavedJob: Function;
  savedJobIds: NumberDictionary<Boolean>;
}

const Card = ({ job, handleToggledSavedJob, savedJobIds }: CardProps) => {
  return (
    <div className="card" key={job.id}>
      <div className="card-text-container">
        <div className="card-element text-secondary">
          {job.title.match(/.*?\)/) || job.title.match(/^[^\s]+/)}
        </div>
        <h3 className="card-element">
          {job.title.match(/is hiring\s+(?:a\s+|an\s+)?(.*)/i)?.[1] || "--"}
        </h3>
        <div className="card-element text-secondary subtitle">
          {new Date(job.time * 1000).toLocaleDateString()}
        </div>
      </div>
      <div className="button-container">
        <button className="grow" onClick={() => window.open(job.url, "_blank")}>
          Apply Now!
        </button>
        <button className="icon" onClick={() => handleToggledSavedJob(job.id)}>
          <FontAwesomeIcon
            icon={savedJobIds[job.id] === true ? solidHeart : outlineHeart}
            className="icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
