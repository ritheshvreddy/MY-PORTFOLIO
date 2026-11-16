import { TypeAnimation } from "react-type-animation";
import type { HeroRole } from "../../services/heroRoles.service";

interface AnimatedRoleProps {
  roles: HeroRole[];
}

export default function AnimatedRole({
  roles,
}: AnimatedRoleProps) {
  if (!roles.length) return null;

  const sequence: (string | number)[] = [];

  roles.forEach((role) => {
    sequence.push(role.title);
    sequence.push(2500);
  });

  return (
    <div className="hero-role animated-role">
      <TypeAnimation
        sequence={sequence}
        wrapper="span"
        speed={45}
        repeat={Infinity}
      />
    </div>
  );
}