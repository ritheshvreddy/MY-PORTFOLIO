import {
  FaDownload,
  FaTerminal,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import type { Profile } from "../../services/profile.service";

import { downloadFile } from "../../utils/download";

interface HeroButtonsProps {
  profile: Profile;
}

export default function HeroButtons({
  profile,
}: HeroButtonsProps) {
  const navigate = useNavigate();

  const downloadResume = async () => {
    if (!profile.resume_file) return;

    await downloadFile(
      profile.resume_file,
      "Rithesh_V_Reddy_Resume.pdf"
    );
  };

  const openTerminal = () => {
    navigate("/terminal");
  };

  return (
    <div className="hero-buttons">
      <button
        className="primary-btn"
        onClick={downloadResume}
      >
        <FaDownload />

        <span>Download Resume</span>
      </button>

      <button
        className="secondary-btn"
        onClick={openTerminal}
      >
        <FaTerminal />

        <span>Interactive Terminal</span>
      </button>
    </div>
  );
}