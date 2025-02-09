export default function Filter() {
  return (
    <>
      <select value="Sort">
        <option value="null">Sort</option>
        <option value="date">Date</option>
        <option value="status">Status</option>
      </select>
      <select value="">
        <option value="null">Sort By Catergory</option>
        <option value="mising">Missing</option>
        <option value="failure">Failure</option>
      </select>
    </>
  );
}
