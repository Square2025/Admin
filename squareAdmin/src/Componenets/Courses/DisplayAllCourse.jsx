import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllCourses } from '../../store/slices/Courses/coursesSlice';
import { FaStar, FaUsers, FaTag, FaArrowRight, FaPlus, FaSearch } from 'react-icons/fa';

const DisplayAllCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#A28DEC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative backdrop-blur-sm bg-white/30" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600">Manage all your courses in one place</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A28DEC] focus:border-transparent bg-white/70 backdrop-blur-sm w-full sm:w-64"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Add Course Button */}
              <button 
                onClick={() => navigate('/add-course')}
                className="bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300 flex items-center justify-center shadow-md"
              >
                <FaPlus className="mr-2" />
                Add New Course
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div 
                key={course._id} 
                className="backdrop-blur-sm bg-white/30 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                onClick={() => handleCourseClick(course._id)}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnailUrl || course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                  {course.badge && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      {course.badge}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <FaStar className="text-yellow-500 mr-1 text-xs" />
                        <span className="text-white text-xs font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <FaUsers className="text-white mr-1 text-xs" />
                        <span className="text-white text-xs">{course.students}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-[#A28DEC] transition-colors duration-300">{course.title}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-[#A28DEC]/30">
                      <img 
                        src={course.instructor?.image || 'https://via.placeholder.com/40'} 
                        alt={course.instructor?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-700">{course.instructor?.name}</span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      {course.isFree ? (
                        <span className="text-green-600 font-bold">Free</span>
                      ) : (
                        <div>
                          {course.discountPrice < course.price ? (
                            <div className="flex items-center">
                              <span className="bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] bg-clip-text text-transparent font-bold mr-2">{formatPrice(course.discountPrice)}</span>
                              <span className="text-gray-500 line-through text-sm">{formatPrice(course.price)}</span>
                            </div>
                          ) : (
                            <span className="bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] bg-clip-text text-transparent font-bold">{formatPrice(course.price)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A28DEC]/20 to-[#AAF3EB]/20 flex items-center justify-center group-hover:from-[#A28DEC] group-hover:to-[#AAF3EB] transition-all duration-300">
                      <FaArrowRight className="text-[#A28DEC] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 backdrop-blur-sm bg-white/30 rounded-xl p-10 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#A28DEC]/20 to-[#AAF3EB]/20 flex items-center justify-center">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No courses found</p>
              <button 
                onClick={() => navigate('/add-course')}
                className="mt-4 bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300 inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayAllCourse;