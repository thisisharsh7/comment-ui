import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-grey-800/50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                >
                    <h3 className="text-grey-800 font-bold text-lg">Confirm Deletion</h3>
                    <p className="text-grey-500 mt-2">
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={onCancel}
                            className="bg-grey-100 text-grey-800 p-2 rounded-lg hover:bg-grey-200 focus:outline-none"
                            aria-label="Cancel deletion"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-pink-400 text-white p-2 rounded-lg hover:bg-pink-500 focus:outline-none"
                            aria-label="Confirm deletion"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;