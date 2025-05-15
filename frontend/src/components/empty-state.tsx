import illustrationEmpty from "/images/illustration-empty.svg";

const EmptyState = () => {
  return (
    <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 p-5">
      <div className="mt-[70px] w-[200px]">
        <img
          src={illustrationEmpty}
          alt="empty space"
          className="w-full content-center self-center object-cover"
        />
      </div>

      <h3 className="text-2xl leading-9 font-bold text-black">
        Let’s get you started
      </h3>

      <p className="text-gray">
        Use the “Add new link” button to get started. Once you have more than
        one link, you can reorder and edit them. We’re here to help you share
        your profiles with everyone!
      </p>
    </div>
  );
};

export default EmptyState;
