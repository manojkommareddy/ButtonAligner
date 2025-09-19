import HelpTooltip from '../HelpTooltip';

export default function HelpTooltipExample() {
  return (
    <div className="p-4">
      <span>This field needs help</span>
      <HelpTooltip content="This is helpful information about the field that explains what it does and how to use it properly." />
    </div>
  );
}