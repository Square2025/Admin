import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, clearSelectedCourse } from '../../store/slices/Courses/coursesSlice';
import { FaStar, FaUsers, FaTag, FaArrowLeft, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';

const SingleCoursePage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCourse, singleCourseLoading, singleCourseError } = useSelector((state) => state.courses);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }

    return () => {
      dispatch(clearSelectedCourse());
    };
  }, [dispatch, courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (singleCourseLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#A28DEC]"></div>
      </div>
    );
  }

  if (singleCourseError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10">
        <div className=" border border-red-400 text-red-700 px-4 py-3 rounded relative backdrop-blur-sm bg-white/30" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {singleCourseError}</span>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10">
        <div className="text-gray-500 backdrop-blur-sm bg-white/30 p-6 rounded-lg shadow-lg">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A28DEC]/10 to-[#AAF3EB]/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header with navigation and actions */}
        <div className="flex justify-between items-center mb-6 backdrop-blur-sm bg-white/30 p-4 rounded-xl shadow-lg">
          <button 
            onClick={() => navigate('/all-courses')}
            className="flex items-center text-[#A28DEC] hover:text-[#8a75d1] transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Courses
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/edit-course/${courseId}`)}
              className="flex items-center bg-gradient-to-r from-[#A28DEC] to-[#8a75d1] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-300 shadow-md"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            <button 
              className="flex items-center bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-300 shadow-md"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Course Banner */}
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-xl">
          <img 
            src={selectedCourse.image} 
            alt={selectedCourse.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {selectedCourse.badge && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
              {selectedCourse.badge}
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{selectedCourse.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md">{selectedCourse.subtitle}</p>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Course Meta */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{selectedCourse.rating}</span>
                </div>
                <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                  <FaUsers className="text-[#A28DEC] mr-1" />
                  <span>{selectedCourse.students} students</span>
                </div>
                <div className="bg-white/50 px-3 py-1.5 rounded-full shadow-sm text-gray-700">
                  {selectedCourse.category}
                </div>
                <div className="bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                  Status: <span className={selectedCourse.status === 'active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {selectedCourse.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Description</h2>
              <p className="text-gray-700 mb-4">{selectedCourse.description}</p>
              <p className="text-gray-700">{selectedCourse.longDescription}</p>
            </div>

            {/* What You Will Learn */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">What You Will Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCourse.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start bg-white/50 p-3 rounded-lg shadow-sm">
                    <div className="bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] p-1 rounded-full mr-3 flex-shrink-0">
                      <FaCheck className="text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Course Content</h2>
              <div className="rounded-lg overflow-hidden shadow-sm">
                {selectedCourse.courseContent.map((section) => (
                  <div key={section._id} className="mb-2 rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-[#A28DEC]/10 to-[#AAF3EB]/10 cursor-pointer rounded-t-lg"
                      onClick={() => toggleSection(section._id)}
                    >
                      <h3 className="font-medium text-gray-800">{section.title}</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">{section.lessons.length} lessons</span>
                        <div className={`p-1 rounded-full transition-colors duration-300 ${expandedSections[section._id] ? 'bg-[#A28DEC]/20' : 'bg-white/50'}`}>
                          {expandedSections[section._id] ? <FaChevronUp className="text-[#A28DEC]" /> : <FaChevronDown className="text-[#A28DEC]" />}
                        </div>
                      </div>
                    </div>
                    
                    {expandedSections[section._id] && (
                      <div className="p-4 bg-white/50 rounded-b-lg">
                        {section.lessons.map((lesson) => (
                          <div key={lesson._id} className="flex justify-between items-center py-3 px-2 border-b last:border-b-0 hover:bg-white/30 transition-colors duration-200 rounded-md">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-[#A28DEC] rounded-full mr-3"></div>
                              <span className="text-gray-700">{lesson.title}</span>
                              {lesson.preview && (
                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-700 text-xs rounded-full">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="text-gray-500 text-sm bg-white/50 px-2 py-1 rounded-full">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Requirements</h2>
              <ul className="space-y-2">
                {selectedCourse.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#A28DEC] rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience */}
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Target Audience</h2>
              <ul className="space-y-2">
                {selectedCourse.targetAudience.map((audience, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#AAF3EB] rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg sticky top-6">
              {/* Thumbnail */}
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={selectedCourse.thumbnailUrl} 
                  alt={selectedCourse.title} 
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Price */}
              <div className="mb-6 bg-white/50 p-4 rounded-lg shadow-sm">
                {selectedCourse.isFree ? (
                  <div className="text-2xl font-bold text-green-600">Free</div>
                ) : (
                  <div>
                    {selectedCourse.discountPrice < selectedCourse.price ? (
                      <div className="flex items-end">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] bg-clip-text text-transparent mr-2">
                          {formatPrice(selectedCourse.discountPrice)}
                        </div>
                        <div className="text-lg text-gray-500 line-through">
                          {formatPrice(selectedCourse.price)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#A28DEC] to-[#AAF3EB] bg-clip-text text-transparent">
                        {formatPrice(selectedCourse.price)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6 bg-white/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Course Features</h3>
                <div className="space-y-3">
                  {selectedCourse.features.map((feature) => (
                    <div key={feature._id} className="flex items-center p-2 hover:bg-white/50 rounded-md transition-colors duration-200">
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#A28DEC]/20 to-[#AAF3EB]/20 rounded-full mr-3">
                        <span className="text-lg">{feature.icon}</span>
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Instructor</h3>
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-3 border-2 border-[#A28DEC] p-0.5">
                    <img 
                      src={selectedCourse.instructor.image} 
                      alt={selectedCourse.instructor.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{selectedCourse.instructor.name}</div>
                    <div className="text-sm text-[#A28DEC]">{selectedCourse.instructor.title}</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm bg-white/50 p-3 rounded-md">{selectedCourse.instructor.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;