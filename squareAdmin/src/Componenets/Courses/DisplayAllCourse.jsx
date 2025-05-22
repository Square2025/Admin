import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllCourses } from '../../store/slices/Courses/coursesSlice';
import { FaStar, FaUsers, FaTag, FaArrowRight, FaPlus, FaSearch } from 'react-icons/fa';

const DisplayAllCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.instructor?.name && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [courses, searchTerm]);

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-900/30 border border-red-400 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-300 mt-2">Manage all your courses in one place</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-800/50 backdrop-blur-sm w-full sm:w-64 text-white placeholder-gray-400"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Add Course Button */}
              <button 
                onClick={() => navigate('/add-course')}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add New Course
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div 
                key={course._id} 
                className="group relative bg-gradient-to-br from-slate-800/90 via-purple-900/50 to-slate-900/90 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:border-purple-500/30"
                onClick={() => handleCourseClick(course._id)}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnailUrl || course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                  
                  {course.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                      {course.badge}
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <FaStar className="text-yellow-400 mr-1.5 text-sm" />
                        <span className="text-white text-sm font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        <FaUsers className="text-cyan-400 mr-1.5 text-sm" />
                        <span className="text-white text-sm">{course.students}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{course.title}</h2>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  {/* Instructor */}
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-purple-500/50 p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
                      <img 
                        src={course.instructor?.image || 'https://via.placeholder.com/40'} 
                        alt={course.instructor?.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{course.instructor?.name}</span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      {course.isFree ? (
                        <span className="text-green-400 font-bold text-lg bg-green-400/10 px-3 py-1 rounded-full">Free</span>
                      ) : (
                        <div>
                          {course.discountPrice < course.price ? (
                            <div className="flex items-center">
                              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-lg mr-2">{formatPrice(course.discountPrice)}</span>
                              <span className="text-gray-500 line-through text-sm">{formatPrice(course.price)}</span>
                            </div>
                          ) : (
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-lg">{formatPrice(course.price)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border border-white/20 flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:scale-110">
                      <FaArrowRight className="text-white transition-all duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-700 to-purple-700 flex items-center justify-center">
                <FaSearch className="text-4xl text-gray-300" />
              </div>
              <p className="text-gray-300 text-xl mb-6">
                {searchTerm ? `No courses found matching "${searchTerm}"` : "No courses found"}
              </p>
              <button 
                onClick={() => navigate('/add-course')}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 inline-flex items-center transform hover:scale-105"
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