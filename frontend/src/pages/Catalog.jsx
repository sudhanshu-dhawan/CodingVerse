import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux";
import Error from "./Error";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      console.log("Categories API response:", res);
      const category_id = res?.data?.data?.find(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )?._id;
      console.log("Category ID:", category_id);
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId);
        console.log("Catalog page data:", res);
        setCatalogPageData(res);
      } catch (error) {
        console.log("Error fetching catalog page data:", error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  if (loading || !catalogPageData ) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!loading && !catalogPageData.success) {
    return <Error />;
  }

  const selectedCategory = catalogPageData?.data?.selectedCategory;
  if (!selectedCategory?.courses || selectedCategory.courses.length === 0) {
    return <Error message="No courses found in this category" />;
  }
console.log("Selected Category:", catalogPageData?.data?.selectedCategory);
console.log("Courses:", catalogPageData?.data?.selectedCategory?.courses);

console.log("Most Selling Courses:", catalogPageData?.data?.mostSellingCourses);
console.log("Catalog Name:", catalogName);

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading text-white">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${active === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"} cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${active === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"} cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <CourseSlider Courses={selectedCategory?.courses} />
        </div>
      </div>

      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading text-white">Top courses in {catalogPageData?.data?.differentCategory?.name}</div>
        <div className="py-8">
          <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading text-white">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {catalogPageData?.data?.mostSellingCourses?.length > 0 ? (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {catalogPageData.data.mostSellingCourses.slice(0, 4).map((course, i) => (
      <Course_Card course={course} key={i} Height={"h-[400px]"} />
    ))}
  </div>
) : (
  <div>No courses available</div>
)}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Catalog;
