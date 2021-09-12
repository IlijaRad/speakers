import Speaker from "./Speaker";
import useRequestDelay, { REQUEST_STATUS } from "../hooks/useRequestDelay";
import { data } from "../../SpeakerData";
import { SpeakerFilterContext } from "../context/SpeakerFilterContext";
import { useContext } from "react";

function SpeakersList() {
  const {
    data: speakersData,
    requestStatus,
    error,
    updateRecord,
  } = useRequestDelay(1500, data);

  const { searchQuery, eventYear } = useContext(SpeakerFilterContext);

  if (requestStatus === REQUEST_STATUS.FAILURE) {
    return (
      <div className="text-danger">
        Error: <b>loading Speaker Data Failed {error}</b>
      </div>
    );
  }

  if (requestStatus === REQUEST_STATUS.LOADING) return <div>Loading...</div>;

  return (
    <div className="container speakers-list">
      <div className="row">
        {speakersData
          .filter(function (speaker) {
            return (
              speaker.first.toLowerCase().includes(searchQuery) ||
              speaker.last.toLowerCase().includes(searchQuery)
            );
          })
          .filter(function (speaker) {
            return speaker.sessions.find((session) => {
              return session.eventYear === eventYear;
            });
          })
          .map(function (speaker) {
            return (
              <Speaker
                key={speaker.id}
                speaker={speaker}
                onFavoriteToggle={(doneCallback) => {
                  updateRecord(
                    {
                      ...speaker,
                      favorite: !speaker.favorite,
                    },
                    doneCallback
                  );
                }}
              />
            );
          })}
      </div>
    </div>
  );
}

export default SpeakersList;
