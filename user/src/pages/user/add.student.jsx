import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  MapPin,
  Phone,
  Trash2,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddStudentModal from "../../components/AddStudentModal";
import {
  addStudentHook,
  getAllStudentsHook,
  deleteStudentHook,
} from "../../hooks/add.student.hook.js";

const ManageStudent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { mutate: addStudent, isPending: isAdding } = addStudentHook();
  const { data: studentsData, isLoading, isError } = getAllStudentsHook();
  const { mutate: deleteStudent, isPending: isDeleting } = deleteStudentHook();

  const students = studentsData?.data || [];

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase()?.includes(term) ||
      student.email?.toLowerCase()?.includes(term) ||
      student.city?.toLowerCase()?.includes(term) ||
      student.number?.toString()?.includes(term)
    );
  });

  const handleDelete = (id, name) => {
    if (
      window.confirm(`Are you sure you want to delete the student "${name}"?`)
    ) {
      deleteStudent(id);
    }
  };

  const handleAddSubmit = (data, resetForm) => {
    addStudent(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        resetForm();
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all registered students across your library network.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Total Students
            </p>
            <p className="text-3xl font-bold text-brand-600">
              {students.length}
            </p>
          </div>
          <div className="p-3 bg-brand-50 rounded-xl">
            <Users className="w-6 h-6 text-brand-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Active Students
            </p>
            <p className="text-3xl font-bold text-green-600">
              {students.length}
            </p>
          </div>
          <div className="p-3 bg-brand-50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-brand-600" />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative flex items-center bg-slate-50 rounded-xl border border-brand-100/50 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search by name, email, city or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-brand-500" />
            <p className="text-sm font-medium">Loading students...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="text-sm font-medium">
              Failed to load students. Please check your connection.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No students registered yet</p>
            {searchTerm && (
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && filteredStudents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-50 hover:bg-slate-50 transition-colors"
                  >
                    {/* Student Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0 uppercase">
                          {student.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm capitalize">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {student.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.number}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-[180px]">
                          {student.email}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="capitalize">{student.city}</p>
                          <p className="text-xs text-slate-500 capitalize">
                            {student.state}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-full bg-green-50 text-green-700 border border-green-100 uppercase">
                        ACTIVE
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 inline-flex"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredStudents.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="font-medium">{filteredStudents.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 px-2">
                    Page {currentPage} of {Math.ceil(filteredStudents.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredStudents.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredStudents.length / itemsPerPage)}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubmit}
        isPending={isAdding}
      />
    </div>
  );
};

export default ManageStudent;
