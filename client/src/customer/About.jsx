import Jumbotron from "../components/Jumbotron";

const gardenImg = (
  <img
    className="object-cover w-full rounded-lg h-full"
    src={new URL("../assets/gardenTomato.jpg", import.meta.url).href}
    alt=""
  />
);
const doughImg = (
  <img
    className="object-cover w-full rounded-lg h-full"
    src={new URL("../assets/dough.jpg", import.meta.url).href}
    alt=""
  />
);

const herbsImg = (
  <img
    className="object-cover w-full rounded-lg h-full"
    src={new URL("../assets/herbs.jpg", import.meta.url).href}
    alt=""
  />
);
// const peppersImg = (
//   <img
//     className="object-cover w-full h-100 rounded-lg"
//     src={new URL("../assets/peppers.jpg", import.meta.url).href}
//     alt=""
//   />
// );
// const sauceImg = (
//   <img
//     className="object-cover w-full rounded-lg h-100"
//     src={new URL("../assets/sauce.jpg", import.meta.url).href}
//     alt=""
//   />
// );

const ourIngredients = (
  <div className="text-3xl cursiveFont text-black  text-center p-3">
    <h1 className="text-2xl font-bold text-slate-800 m-2 text-shadow-gray-700 text-shadow-sm">
      From Hearth to Table: Freshness & Flavor That Set Us Apart
    </h1>
    <hr className="p-1 border-gray-700 " />
    <p className="p-2">
      We’re passionate about using only the freshest, highest quality
      ingredients in every pizza. Our commitment to flavor starts with locally
      sourced produce and time-honored traditions.
    </p>
    <p className="p-2">
      Our tomatoes are picked at their peak for a sauce that’s perfectly
      balanced and vibrant. We choose cheeses from trusted dairies for a creamy,
      rich melt, and select meats for their bold, savory taste.
    </p>
    <p className="p-2">
      Every vegetable is hand-prepared, and our dough is crafted daily for the
      ideal texture and flavor. It’s this attention to detail that makes our
      pizzas truly stand out.
    </p>
    <p className="p-2">
      When you dine with us, you’re enjoying a meal made with care, passion, and
      the finest ingredients—because you deserve nothing less.
    </p>
  </div>
);

const ourPurpose = (
  <div className="text-3xl cursiveFont font-medium text-black text-center p-3">
    <h1 className="text-2xl font-bold text-black m-2 p-2  text-shadow-gray-600 text-shadow-sm">
      Our Purpose
    </h1>
    <hr className="p-1 border-black mb-1" />
    <p className="p-2">
      At OverTheWall, our purpose is to bring neighbors together with
      handcrafted Boston-style pizza, made from quality ingredients and family
      tradition.
    </p>
    <p className="p-2">
      We’re a small, family-owned business dedicated to sharing comfort, flavor,
      and a welcoming space with our community.
    </p>
    <p className="p-2">
      Thank you for letting us serve you and be part of your neighborhood!
    </p>
  </div>
);

const ourMissionStatement = (
  <div className="text-4xl cursiveFont text-black text-center p-3 ">
    <h1 className="text-3xl font-bold text-black m-2 p-2  text-shadow-gray-800 text-shadow-sm">
      Boston-Bred Classics: Savoring Neighbors Close by
    </h1>
    <hr className="border-black mb-1 p-1" />

    <p className="p-2">
      As a family-owned small business, our mission is to share the art of
      Boston and New York-style pizza with our neighbors. Every pie is crafted
      with care, tradition, and a love for bringing people together.
    </p>
    <p className="p-2">
      We believe great pizza connects communities—so let’s raise a slice,
      celebrate good times, and enjoy a taste of home, made just for you.
    </p>
  </div>
);

const Home = () => {
  return (
    <>
      <div>
        <Jumbotron />
      </div>
      <div className="grid grid-cols-3 xl:grid-cols-3 gap-5 px-4 py-4 mb-15 ms-5">
        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black">
          {gardenImg}{" "}
        </div>
        <div className="w-full bg-green-200 rounded-xl col-span-2 shadow-2xl shadow-green-900">
          {ourIngredients}{" "}
        </div>

        <div className="w-full bg-white shadow-black rounded-xl col-span-2 shadow-2xl">
          {ourPurpose}
        </div>
        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black">
          {doughImg}{" "}
        </div>

        <div className="w-full bg-red-900 rounded-xl shadow-2xl shadow-black">
          {herbsImg}{" "}
        </div>
        <div className="w-full bg-red-900 rounded-xl col-span-2  shadow-2xl shadow-red-600">
          {ourMissionStatement}
        </div>
      </div>
    </>
  );
};

export default Home;
