import StatusLight from '../StatusLight';

export default function StatusLightExample() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <StatusLight status="GREEN" />
        <span>Green - All criteria passed</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusLight status="YELLOW" />
        <span>Yellow - 2/3 criteria passed</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusLight status="RED" />
        <span>Red - 0-1 criteria passed</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusLight status="IDLE" />
        <span>Idle - No analysis yet</span>
      </div>
    </div>
  );
}